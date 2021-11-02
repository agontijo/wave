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
    user: Array.isArray(params.users) ? params.users : [],
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
  // Fetch room object
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
  });

  room = room.Item;

  // Add user to user list
  room.users.push(user);

  // Update room in db
  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set users = :u',
    ExpressionAttributeValues: {
      ':u': room.users,
    },
    ReturnValues: 'UPDATED_NEW'
  });

}

async function removeUser(user, RoomID) {
  // Fetch room object
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
  });

  room = room.Item;

  // Remove user from the user list
  let index = room.users.indexOf(user);
  room.users.splice(index, 1);

  // Update room in db
  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set users = :u',
    ExpressionAttributeValues: {
      ':u': room.users,
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

  room = room.Item;

  // Check if user is the host of the room
  _checkHost(user, room);

  // Add genre to allowed genre
  room.genresAllowed.push(genre);

  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set genresAllowed = :g',
    ExpressionAttributeValues: {
      ':g': room.genresAllowed,
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

  room = room.Item;

  // Check if user is the host of the room
  _checkHost(user, room);

  // Add genre to allowed genre
  let index = room.genresAllowed.users.indexOf(genre);
  room.genresAllowed.splice(index, 1);

  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { RoomID },
    UpdateExpression: 'set genresAllowed = :g',
    ExpressionAttributeValues: {
      ':g': room.genresAllowed,
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

  let list_users = room.Item.user;

  return list_users.length;

}


async function getUsers(RoomID) {
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { RoomID }
  });

  if (room?.Item == undefined) { throw Error('Invalid room ID!'); }

  return room.Item.user;
}

async function addSong(RoomID, song_id) {
  const room = (await getRoom(RoomID)).Item;
  const host = (await userActs.getUser(room.host)).Item;
  const song = await spotifyUtils.getTrack(song_id, host.spotifyTok.accessToken);

  // console.log(song);
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
        artists: song.artists.map(a => a.name)
      }],
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
}