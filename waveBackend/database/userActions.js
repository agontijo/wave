const AWS = require('./awsconfig.js');
const emailMapActions = require('./emailMapActions.js');

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

  if (!(await emailMapActions.isEmailAvailble(params.email, params.uname))) {
    throw 'Email is alread in use!';
  }

  const user = {
    uname: params.username,
    pswd: params.password,
    email: params.email,
    displayName: params.displayName ?? 'Wave User',
    spotifyTok: params.spotifyTok ?? null,
  };

  await emailMapActions.setEmailMap(user.email, user.uname);
  await _createUser({
    TableName: 'WVUsers',
    ConditionExpression: 'attribute_not_exists(uname)',
    Item: user,
  });

  return user;
}

async function setUserSpotifyTok(uname, accessToken, refreshToken) {
  return await _updateUser({
    TableName: 'WVUsers',
    Key: { uname },
    UpdateExpression: 'set spotifyTok.accessToken = :a spotifyTok.refreshToken = :r',
    ExpressionAttributeValues: {
      ":a": accessToken,
      ":r": refreshToken,
    },
    ReturnValues: 'UPDATED_NEW'
  });
}

module.exports = {
  _updateUser,
  _getUser,
  _createUser,
  getUser,
  setUserDisplayName,
  setUserPassword,
  createUser,
  setUserSpotifyTok,
};
