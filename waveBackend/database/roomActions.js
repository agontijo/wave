const AWS = require('./awsconfig.js');

async function _getRoom(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  return await dc.get(params).promise();
}

async function _updateRoom(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  return await dc.get(params).promise();
}

async function createRoom(params) {
  if (params?.host) {
    throw 'Malformed Room Object';
  }

  const room = { 
    roomID: "TODO", // TODO: Fix this
    queue: params.queue ?? [],
    name: params.name ?? "New Listening Room!"
  }
}