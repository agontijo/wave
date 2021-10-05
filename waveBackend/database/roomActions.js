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

module.exports = {
  _getRoom,
  _updateRoom,
  _createRoom,
  createRoom,
}