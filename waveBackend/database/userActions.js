const axios = require('axios');
const qs = require('qs');

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

async function _deleteUser(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  await dc.delete(params).promise();
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
    throw Error('Malformed User Object!');
  }

  if (!(await emailMapActions.isEmailAvailble(params.email, params.uname))) {
    throw Error('Email is alread in use!');
  }

  const user = {
    uname: params.username,
    pswd: params.password,
    email: params.email,
    displayName: params.displayName || 'Wave User',
    spotifyTok: params.spotifyTok ?? {},
    currRoom: params.currRoom ?? ""
  };

  const existing = await getUser(user.uname);
  if (existing?.Item) { throw Error('Username is already in use!'); }

  await emailMapActions.setEmailMap(user.email, user.uname);
  await _createUser({
    TableName: 'WVUsers',
    ConditionExpression: 'attribute_not_exists(uname)',
    Item: user,
  });

  return user;
}

async function setSpotifyToks(uname, accessToken, refreshToken) {
  // TODO: Make this its own queriy for faster write time
  return await _setSpotifyToksObject(uname, { accessToken, refreshToken });
}
async function clearSpotifyToks(uname) { return await _setSpotifyToksObject(uname, {}); }
async function _setSpotifyToksObject(uname, toks) {
  return await _updateUser({
    TableName: 'WVUsers',
    Key: { uname },
    UpdateExpression: 'set spotifyTok = :t',
    ExpressionAttributeValues: {
      ":t": toks,
    },
    ReturnValues: 'UPDATED_NEW'
  });
}

async function refreshSpotifyToks(uname, refreshTok) {
  const response = await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: qs.stringify({
      'grant_type': 'refresh_token',
      'refresh_token': refreshTok
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')}`
    }
  });

  // console.log(response.data.access_token);
  await setSpotifyToks(uname, response.data.access_token, refreshTok);
  return response.data.access_token
}


async function setCurrRoom(uname, newRoomID) {
  return await _updateUser({
    TableName: 'WVUsers',
    Key: { uname },
    UpdateExpression: 'set currRoom = :r',
    ExpressionAttributeValues: {
      ':r': newRoomID,
    },
    ReturnValues: 'UPDATED_NEW'
  });
}


async function deleteUser(uname) {

  const theuser = await getUser(uname);

  if(theuser?.Item == undefined) {throw Error('No user with given username');}

  const theemail = theuser.Item.email;

  await emailMapActions.deleteEmailMap(theemail)

  return await _deleteUser({
    TableName: 'WVUsers',
    Key : {uname},
  });

}


module.exports = {
  _updateUser,
  _getUser,
  _createUser,
  _deleteUser,
  getUser,
  setUserDisplayName,
  setUserPassword,
  createUser,
  setSpotifyToks,
  refreshSpotifyToks,
  clearSpotifyToks,
  setCurrRoom,
  deleteUser,
};
