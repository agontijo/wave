const AWS = require('./awsconfig.js');
const userActs = require('./userActions.js');
const generate = require('../utils/generators.js');
const spotifyUtils = require('../utils/spotifyUtils');
const { isString } = require('../utils/helpers');

async function _getRoom(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  return await dc.get(params).promise();
}

async function _updateRoom(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  return await dc.update(params).promise();
}

async function _createRoom(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  await dc.put(params).promise();
}

async function createRoom(params) {
  if (!params?.host) {
    throw 'Malformed Room Object';
  }


  const room = {
    RoomID: generate.eightDigitHexID(),
    host: params.host,
    queue: Array.isArray(params.queue) ? params.queue : [],
    userList: Array.isArray(params.users) ? params.users : [],
    previous: Array.isArray(params.previous) ? params.previous : [],    // Previously played songs
    roomname: params.name ?? "New Listening Room!",
    allowExplicit: params.allowExplicit ?? true,
    popularSort: params.popularSort ?? false,
    genresAllowed: Array.isArray(params.genresAllowed) ? params.genresAllowed : [],
    songThreshold: isNaN(params.songThreshold) ? 0.5 : params.songThreshold,
    waitingRoom: Array.isArray(params.waiting) ? params.waiting : [],
    bannedList: Array.isArray(params.banned) ? params.banned : [],
    isMod: params.isMod ? true : false
  };

  await _createRoom({
    TableName: 'WVRooms',
    ConditionExpression: 'attribute_not_exists(RoomID)',
    Item: room,
  });

  await userActs.setCurrRoom(params.host, room.RoomID);

  return room;
}

// Can call this function whenever room settings are about to be modified
// Throws an error if the user trying to edit is not the host of the room
function _checkHost(user, room) {
  if (!(user === room.host)) {
    throw 'User Not Authorized to Edit Room';
  }
}

async function getRoom(RoomID) {
  // console.log(RoomID)
  return await _getRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
  });
}

async function addUser(user, RoomID, userList = 'userList') {
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
  });

  let item = room.Item;

  if (item[userList] && !item[userList].includes(user)) item[userList].push(user);
  // console.log(item);
  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: `set ${userList} = :u`,
    ExpressionAttributeValues: {
      ':u': item[userList],
    },
    ReturnValues: 'UPDATED_NEW'
  });

}

async function removeUser(user, RoomID, userList = 'userList') {
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
  });

  let item = room.Item;

  if (item[userList].includes(user)) {
    index = item[userList].indexOf(user);
    item[userList].splice(index, 1);
    if (userList === 'userList')
      await userActs.setCurrRoom(user, '');
  }

  // This block should only be entered if a host is leaving their own room
  if (item.host == user && userList === 'userList') {
    item[userList].forEach(async function (auser) {
      await userActs.setCurrRoom(auser, '')
    });

    return await _destroyRoom({
      TableName: 'WVRooms',
      Key: { RoomID }
    });
  }

  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: `set ${userList} = :u`,
    ExpressionAttributeValues: {
      ':u': item[userList],
    },
    ReturnValues: 'UPDATED_NEW'
  });

}

async function admitUser(RoomID, host, user) {
  return await _adminMoveUser(RoomID, host, user, 'waitingRoom', 'userList');
}

async function denyUser(RoomID, host, user) {
  return await _adminMoveUser(RoomID, host, user, 'waitingRoom', null);
}

async function kickUser(RoomID, host, user) {
  return await _adminMoveUser(RoomID, host, user, 'userList', 'bannedList');
}

async function _adminMoveUser(RoomID, host, user, from, to) {
  const room = (await getRoom(RoomID)).Item;
  _checkHost(host, room);
  if (room[from]?.includes(user)) {
    const data = await removeUser(user, RoomID, from);
    if (!to) return data;
  } else {
    throw Error(`Could not remove user '${user}' from list: ${from} in room: '${RoomID}'`);
  }
  return await addUser(user, RoomID, to)
}

async function destroyRoom(user, RoomID) {
  console.log(`DESTROY ROOM ${RoomID}`);

  // Fetch room object
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
  });

  // console.log(user)
  // console.log(room)

  // Check if user is the host of the room
  _checkHost(user, room.Item);

  // Set user's current room as a nothing
  await userActs.setCurrRoom(user, '');

  return await _destroyRoom({
    TableName: 'WVRooms',
    Key: { RoomID }
  });

}

async function _destroyRoom(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  await dc.delete(params).promise();
}

// Set room name
async function setRoomName(user, RoomID, roomName) {
  // Fetch room object
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
  });

  room = room.Item;

  // Check if user is the host of the room
  _checkHost(user, room);

  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set roomname = :n',
    ExpressionAttributeValues: {
      ':n': roomName,
    },
    ReturnValues: 'UPDATED_NEW'
  });
}

// Add genre to allowed music genres
async function addGenre(user, RoomID, genre) {

  // Fetch room object
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
  });

  let item = room.Item;

  // Check if user is the host of the room
  _checkHost(user, item);

  if (!item.genresAllowed.includes(genre)) item.genresAllowed.push(genre);

  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set genresAllowed = :g',
    ExpressionAttributeValues: {
      ':g': item.genresAllowed,
    },
    ReturnValues: 'UPDATED_NEW'
  });
}

// Remove genre to allowed music genres
async function removeGenre(user, RoomID, genre) {

  // Fetch room object
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
  });

  let item = room.Item;

  // Check if user is the host of the room
  _checkHost(user, item);

  if (item.genresAllowed.includes(genre)) {
    index = item.genresAllowed.indexOf(genre);
    item.genresAllowed.splice(index, 1);
  }

  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set genresAllowed = :g',
    ExpressionAttributeValues: {
      ':g': item.genresAllowed,
    },
    ReturnValues: 'UPDATED_NEW'
  });

}

// Set allow expicit
async function setAllowExplicit(user, RoomID, allow) {
  // Fetch room object
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
  });

  room = room.Item;

  // Check if user is the host of the room
  _checkHost(user, room);

  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set allowExplicit = :a',
    ExpressionAttributeValues: {
      ':a': allow,
    },
    ReturnValues: 'UPDATED_NEW'
  });
}

// Set dislike threshold
async function setThreshold(user, RoomID, threshold) {
  // Fetch room object
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
  });

  room = room.Item;

  // Check if user is the host of the room
  _checkHost(user, room);

  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set songThreshold = :t',
    ExpressionAttributeValues: {
      ':t': threshold,
    },
    ReturnValues: 'UPDATED_NEW'
  });
}

async function getNumberOfUsers(RoomID) {
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
  });

  if (room?.Item == undefined) { throw Error('Invalid roomID!'); }

  let list_users = room.Item.userList;

  return list_users.length;

}


async function getUsers(RoomID) {
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { RoomID }
  });

  if (room?.Item == undefined) { throw Error('Invalid room ID!'); }

  return room.Item.userList;
}

async function addSong(RoomID, song_id) {
  const room = (await getRoom(RoomID)).Item;
  const host = (await userActs.getUser(room.host)).Item;

  if (!host.spotifyTok.expireTime || host.spotifyTok.expireTime < Date.now()) {
    host.spotifyTok.accessToken = await userActs.refreshSpotifyToks(host.uname, host.spotifyTok.refreshToken);
  }

  const host_tok = host.spotifyTok.accessToken;
  const song = await spotifyUtils.getTrack(song_id, host_tok);
  const genres = (await spotifyUtils.getArtist(song.artists[0].id, host_tok)).genres;
  const genre = genres[0];

  let err = _checkSongFilterMatch(song, genres, room);
  if (err < 0) return err;

  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set #q = list_append(#q, :qval)',
    ExpressionAttributeNames: {
      "#q": "queue"
    },
    ExpressionAttributeValues: {
      ':qval': [{
        id: song.id,
        uri: song.uri,
        liked: [],
        disliked: [],
        duration_ms: song.duration_ms,
        name: song.name,
        artists: song.artists.map(a => a.name),
        explicit: song.explicit,
        genre,
        otherGenres: genres,
        listId: Date.now()
      }],
    },
    ReturnValues: 'UPDATED_NEW'
  });
}

// returns 0 if the song fits the filters
// -1 : genre not allowed
// -2 : explicit song not allowed
function _checkSongFilterMatch(songObj, genreList, roomObj) {
  // if the room has no genre filter, ignore
  if (roomObj.genresAllowed && roomObj.genresAllowed.length > 0) {
    // if the song has no genre, ignore
    if (genreString !== "") {
      var found = false;
      // check if the genre string is allowed
      for (var i = 0; i < genreList.length; i++) {
        var genreString = genreList[i];
        if (roomObj.genresAllowed.indexOf(genreString) != -1) {
          // not found, do not allow song
          found = true;
          break;
        }
      }
      
      // none of the genres could be found in the allowed genres list
      if (!found) return -1;
      
    }
  }

  // if the room allows explicit songs, ignore
  if (!roomObj.allowExplicit) {
    // if the song is explicit, do not allow
    if (songObj.explicit) {
      return -2;
    }
  }
  return 0;
}

async function removeSongAtIndex(RoomID, index) {
  const room = isString(RoomID) ? (await getRoom(RoomID)).Item : RoomID;
  RoomID = room.RoomID;

  if (room.queue.length <= index) {
    return -1;
  }

  await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: `REMOVE queue[${index}]`,
    ReturnValues: 'UPDATED_NEW'
  });

  return room.queue[index];
}

async function popSongFromQueue(RoomID) {
  const room = isString(RoomID) ? (await getRoom(RoomID)).Item : RoomID;
  RoomID = room.RoomID;
  if (room.popularSort) {
    return await removeSongAtIndex(
      room,
      room
        .queue
        .map(s => s.liked.length - s.disliked.length)
        .reduce(
          (maxi, curr, i, arr) => maxi = curr > arr[maxi] ? i : maxi,
          0
        )
    );
  }
  return await removeSongAtIndex(room, 0);
}

async function upvoteSong(RoomID, song_id, user) {
  const room = (await getRoom(RoomID)).Item;
  //const host = (await userActs.getUser(room.host)).Item;
  // const song = await spotifyUtils.getTrack(song_id, host.spotifyTok.accessToken);

  let thesong = undefined;
  // manually update song object

  console.log('camehere');

  for (let i = 0; i < room.queue.length; i++) {
    const s = room.queue[i];
    if (s.id === song_id) {
      thesong = s;
      console.log(s)
      // add user to the upvote list, but only if they are not already on the list
      if (!s.liked.includes(user)) {
        s.liked.push(user);
        if (s.disliked.includes(user)) {
          index = s.disliked.indexOf(user);
          s.disliked.splice(index, 1);
        }
      }
      else {
        index = s.liked.indexOf(user)
        s.liked.splice(index, 1)
      }
      // remove the user from the downvote list, but only if they were on the list already

      break;
    }
  }

  await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set queue = :q',
    ExpressionAttributeValues: {
      ':q': room.queue,
    },
    ReturnValues: 'UPDATED_NEW'
  });

  console.log(thesong.liked);

  return thesong.liked;
}

async function downvoteSong(RoomID, song_id, user) {
  const room = (await getRoom(RoomID)).Item;
  // const host = (await userActs.getUser(room.host)).Item;
  // const song = await spotifyUtils.getTrack(song_id, host.spotifyTok.accessToken);

  let check = false;
  let indexRem = undefined;
  let thesong = undefined;
  // manually update song object

  for (let i = 0; i < room.queue.length; i++) {
    const s = room.queue[i];
    // console.log(s.id == song_id);
    if (s.id === song_id) {
      // add user to the downvote list, but only if they are not already on the list
      console.log(s);
      thesong = s;

      if (!s.disliked.includes(user)) {
        console.log(`Is s.disliked arr ${Array.isArray(s.disliked)}`);
        s.disliked.push(user);
      }
      else {
        index = s.disliked.indexOf(user)
        s.disliked.splice(index, 1)
        break;
      }
      // remove the user from the upvote list, but only if they were on the list already
      if (s.liked.includes(user)) {
        index = s.liked.indexOf(user);
        s.liked.splice(index, 1);
      }

      const totusers = await getNumberOfUsers(RoomID);

      console.log(`s.disliked.length = ${s.disliked.length}`)
      if (s.disliked && s.disliked.length > (totusers / 2) && totusers >= 3) {
        check = true
        indexRem = room.queue.indexOf(s)
      }

      break;

    }
  }

  if (check) {
    room.queue.splice(indexRem, 1)
  }

  await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set queue = :q',
    ExpressionAttributeValues: {
      ':q': room.queue,
    },
    ReturnValues: 'UPDATED_NEW'
  });

  return thesong.disliked;
}

async function moveSongToPrev(RoomID, song, user) {
  const room = (await getRoom(RoomID)).Item;
  // const host = (await userActs.getUser(room.host)).Item;
  // const song = await spotifyUtils.getTrack(song_id, host.spotifyTok.accessToken);

  _checkHost(user, room);

  // let index = 0;

  // for (s in room.queue) {
  //   if (s.id === song.id) {
  //     // remove this song, and put it in the previous queue
  //     room.previous.push(s);
  //     room.queue.splice(index, 1);

  //     break;
  //   }
  //   index += 1;
  // }

  // return await _updateRoom({
  //   TableName: 'WVRooms',
  //   Key: { RoomID },
  //   UpdateExpression: 'set queue = :q',
  //   ExpressionAttributeValues: {
  //     ':q': room.queue,
  //   },
  //   ReturnValues: 'UPDATED_NEW'
  // });
  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set #q = list_append(#q, :qval)',
    ExpressionAttributeNames: {
      "#q": "previous"
    },
    ExpressionAttributeValues: {
      ':qval': [song],
    },
    ReturnValues: 'UPDATED_NEW'
  });
}

async function removeSong(RoomID, listId) {
  const room = (await getRoom(RoomID)).Item;

  for (let i = 0; i < room.queue.length; i++) {
    const s = room.queue[i];
    console.log(s.listId == listId);
    if (s.listId == listId) {
      // remove song
      let index = room.queue.indexOf(s)
      room.queue.splice(index, 1)
      
      console.log(s);
      break;

    }
  }

  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set queue = :q',
    ExpressionAttributeValues: {
      ':q': room.queue,
    },
    ReturnValues: 'UPDATED_NEW'
  });
}


async function setPopQueueFiled(RoomID, host, isPop) {
  const room = isString(RoomID) ? (await getRoom(RoomID)).Item : RoomID;
  RoomID = room.RoomID;

  _checkHost(host, room);

  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set popularSort = :p',
    ExpressionAttributeValues: {
      ':p': isPop,
    },
    ReturnValues: 'UPDATED_NEW'
  });
}

async function togglePopularQueueSort(RoomID, host) {
  const room = isString(RoomID) ? (await getRoom(RoomID)).Item : RoomID;
  return await setPopQueueFiled(room, host, !room.popularSort);
}

module.exports = {
  _getRoom,
  _updateRoom,
  _createRoom,
  _destroyRoom,
  _checkHost,
  createRoom,
  getRoom,
  addUser,
  removeUser,
  destroyRoom,
  setRoomName,
  addGenre,
  removeGenre,
  setAllowExplicit,
  setThreshold,
  getNumberOfUsers,
  getUsers,
  addSong,
  removeSongAtIndex,
  popSongFromQueue,
  upvoteSong,
  downvoteSong,
  moveSongToPrev,
  admitUser,
  denyUser,
  kickUser,
  removeSong,
  togglePopularQueueSort,
}