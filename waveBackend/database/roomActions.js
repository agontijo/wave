const AWS = require('./awsconfig.js');
const generate = require('../utils/generators.js');

async function _getRoom(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  return await dc.get(params).promise();
}

async function _updateRoom(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  return await dc.get(params).promise();
}

async function _createRoom(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  await dc.put(params).promise();
}

async function createRoom(params) {
  if (params?.host) {
    throw 'Malformed Room Object';
  }

  const room = { 
    roomID: generate.eightDigitHexID(),
    host: params.host,
    queue: params.queue ?? [],
    user: params.users ?? [],
    name: params.name ?? "New Listening Room!",
    allowExplicit: params.allowExplicit ?? true,
    generesAllowed: params.generesAllowed ?? [],
    songThreshold: params.songThreshold ?? 0.5,
  };

  await _createRoom({
    TableName: 'WVRooms',
    ConditionExpression: 'attribute_not_exists(roomID)',
    Item: room,
  });

  return room;
}

// Can call this function whenever room settings are about to be modified
// Throws an error if the user trying to edit is not the host of the room
async function _checkHost(user, room) {
  if (!(user === room.host)) {
    throw 'User Not Authorized to Edit Room';
  }
}

async function getRoom(roomID) {

  return await _getRoom({
    TableName: 'WVRooms',
    Key: { roomID },
  });
}

async function addUser(user, roomID) {
  // Fetch room object
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { roomID },
  });

  // Add user to user list
  room.users.push(user);

  // Update room in db
  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { roomID },
    UpdateExpression: 'set users = :u',
    ExpressionAttributeValues: {
      ':u': room.users,
    },
    ReturnValues: 'UPDATED_NEW'
  });

}

async function removeUser(user, roomID) {
  // Fetch room object
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { roomID },
  });

  // Remove user from the user list
  let index = room.users.indexOf(user);
  room.users.splice(index, 1);

  // Update room in db
  return await _updateRoom({
    TableName: 'WVRooms',
    Key: { roomID },
    UpdateExpression: 'set users = :u',
    ExpressionAttributeValues: {
      ':u': room.users,
    },
    ReturnValues: 'UPDATED_NEW'
  });

}

async function destroyRoom(user, roomID) {
  // Fetch room object
  let room = await _getRoom({
    TableName: 'WVRooms',
    Key: { roomID },
  });

  // Check if user is the host of the room
  _checkHost(user, room);

  return await _destroyRoom({
    TableName: 'WVRooms',
    Key: { roomID }
  });

}

async function _destroyRoom(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  await dc.delete(params).promise();
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
}