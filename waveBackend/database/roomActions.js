const AWS = require('./awsconfig.js');
const userActs = require('./userActions.js');
const generate = require('../utils/generators.js');
const spotifyUtils = require('../utils/spotifyUtils');

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
    genresAllowed: Array.isArray(params.genresAllowed) ? params.genresAllowed : [],
    songThreshold: isNaN(params.songThreshold) ? 0.5 : params.songThreshold,
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

async function addUser(user, RoomID) {
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
  });

  let item = room.Item;

  if (!item.userList.includes(user)) item.userList.push(user);

  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set userList = :u',
    ExpressionAttributeValues: {
      ':u': item.userList,
    },
    ReturnValues: 'UPDATED_NEW'
  });

}

async function removeUser(user, RoomID) {
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
  });

  let item = room.Item;

  if (item.userList.includes(user)) {
    index = item.userList.indexOf(user);
    item.userList.splice(index, 1);
  }

  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set userList = :u',
    ExpressionAttributeValues: {
      ':u': item.userList,
    },
    ReturnValues: 'UPDATED_NEW'
  });

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
  const song = await spotifyUtils.getTrack(song_id, host.spotifyTok.accessToken);


  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set #q = list_append(#q, :qval)',
    ExpressionAttributeNames : {
      "#q" : "queue"
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
        explicit: song.explicit
      }],
    },
    ReturnValues: 'UPDATED_NEW'
  });
}

async function upvoteSong(RoomID, song_id, user) {
  const room = (await getRoom(RoomID)).Item;
  const host = (await userActs.getUser(room.host)).Item;
  const song = await spotifyUtils.getTrack(song_id, host.spotifyTok.accessToken);

  // manually update song object
  for (s in room.queue) {
    if (s.id === song.id) {
      // add user to the upvote list, but only if they are not already on the list
      if (!s.liked.includes(user)) s.liked.push(user);
      // remove the user from the downvote list, but only if they were on the list already
      if (s.disliked.includes(user)) {
        index = s.disliked.indexOf(user);
        s.disliked.splice(index, 1);
      }
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

async function downvoteSong(RoomID, song_id, user) {
  const room = (await getRoom(RoomID)).Item;
  const host = (await userActs.getUser(room.host)).Item;
  const song = await spotifyUtils.getTrack(song_id, host.spotifyTok.accessToken);

  // manually update song object
  for (s in room.queue) {
    if (s.id === song.id) {
      // add user to the downvote list, but only if they are not already on the list
      if (!s.disliked.includes(user)) s.liked.push(user);
      // remove the user from the upvote list, but only if they were on the list already
      if (s.liked.includes(user)) {
        index = s.disliked.indexOf(user);
        s.disliked.splice(index, 1);
      }
      break;
    }
  }

  // TODO: check if song meets downvote threshold, and remove it if it does

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
  upvoteSong,
  downvoteSong
}