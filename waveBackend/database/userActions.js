const AWS = require('./awsconfig.js')

// Protected helper functions
async function _updateUser(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  return await dc.update(params).promise()
}

async function _getUser(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  return await dc.get(params).promise();
}

async function _createUser(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  await dc.put(params).promise();
}

// Getters
async function getUser(uname) {
  return await _getUser({
    TableName: 'WVUsers',
    Key: { uname },
  });
}

// Setters and Updaters
async function setUserDisplayName(uname, displayName) {
  return await _updateUser({
    TableName: 'WVUsers',
    Key: { uname },
    UpdateExpression: 'set displayName = :d',
    ExpressionAttributeValues: {
      ':d': displayName,
    },
    ReturnValues: 'UPDATED_NEW'
  });
}

async function setUserPassword(uname, pswd) {
  return await _updateUser({
    TableName: 'WVUsers',
    Key: { uname },
    UpdateExpression: 'set pswd = :p',
    ExpressionAttributeValues: {
      ':p': pswd,
    },
    ReturnValues: 'UPDATED_NEW'
  });
}

// Add New User
async function createUser(params) {
  if (!(
    params.username &&
    params.password &&
    params.email
  )) {
    throw 'Malformed User Object!';
  }

  const user = {
    uname: params.username,
    pswd: params.password,
    email: params.email,
    displayName: params.displayName ?? 'Wave User'
  };

  await _createUser({
    TableName: 'WVUsers',
    ConditionExpression: 'attribute_not_exists(uname)',
    Item: user,
  });

  return user;
}

module.exports = {
  _updateUser,
  _getUser,
  _createUser,
  getUser,
  setUserDisplayName,
  setUserPassword,
  createUser,
};
