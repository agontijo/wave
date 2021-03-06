const axios = require('axios');
const qs = require('qs');

var nodemailer = require('nodemailer');

const AWS = require('./awsconfig.js');
const emailMapActions = require('./emailMapActions.js');
const { WellArchitected } = require('aws-sdk');

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

async function _createVEntry(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  await dc.put(params).promise();
}

async function _getEntry(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  return await dc.get(params).promise();
}

// Getters
async function getUser(uname) {
  return await _getUser({
    TableName: 'WVUsers',
    Key: { uname },
  });
}

async function getEntry(email) {
  return await _getEntry({
    TableName: 'WVcodemap',
    Key: { email }
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

/*
//Add vcode entry

async function createVEntry (entry) {
  await _createVEntry({
    TableName: 'WVcodemap',
    ConditionExpression: 'attribute_not_exists(email)',
    Item: entry,
  });
}
*/
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
    currRoom: params.currRoom ?? "",
    isVerified: false,
  };

  const existing = await getUser(user.uname);
  if (existing?.Item) { throw Error('Username is already in use!'); }
  console.log(params.host);
  try {
    await sendVEmail(params.email, params.host);
  }
  catch(err) {
    throw Error('Cannot verify email!')
  }

  await emailMapActions.setEmailMap(user.email, user.uname);
  await _createUser({
    TableName: 'WVUsers',
    ConditionExpression: 'attribute_not_exists(uname)',
    Item: user,
  });

  return user;
}

async function setSpotifyToks(uname, accessToken, refreshToken, expireTime) {
  // TODO: Make this its own queriy for faster write time
  return await _setSpotifyToksObject(uname, { accessToken, refreshToken, expireTime });
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
  await setSpotifyToks(uname, response.data.access_token, refreshTok,  Date.now() + response.data.expires_in * 1000);
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

async function sendEmail (uname) {
  console.log(uname);
  const auser = await getUser(uname);
  if (auser?.Item == undefined) {throw Error('invalid_username');}
  const email = auser.Item.email;
  console.log(email)

  let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'waveproject407@gmail.com',
      pass: '407wave#project',
    }
  });
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  let newpswd = s4() + "mtMT!";
  console.log(newpswd);

  await setUserPassword(uname, newpswd);

  let email_body = "Dear Wave User " + uname + "\n" + " Your new password is " + newpswd;

  let mailDetails = {
    from: 'waveproject407@gmail.com',
    to: email,
    subject: "Reseting Your Wave Account Password",
    text: email_body
  };
  console.log("here4");

  mailTransporter.sendMail(mailDetails, function (err, info) {
    if (err) {
      console.log(err);
      throw Error("could_not")
    }
    else {
      console.log(info.messageId);
    }
  });

}

async function sendVEmail (email, host) {
  console.log(email);
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  let code = s4() + s4();
  console.log(host);
  console.log(code);
  var link = "http://"+host+"/auth/verify?id="+code+"&email="+email;
  console.log(link);

  let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'waveproject407@gmail.com',
      pass: '407wave#project',
    }
  });

  let email_body = "Please click the below link to verify your Wave account\n" + link;

  let mailDetails = {
    from: 'waveproject407@gmail.com',
    to: email,
    subject: "Verifying Your Wave Account",
    text: email_body
  };

  const entry = {
    email: email,
    code: code
  };


  mailTransporter.sendMail(mailDetails, function (err, info) {
    if (err) {
      console.log(err);
      throw Error("could_not");
    }
    else {
      console.log(info.messageId);
    }
  });

  await _createVEntry({
    TableName: 'WVcodemap',
    ConditionExpression: 'attribute_not_exists(email)',
    Item: entry,
  });

}


async function verifyCode (scode, temail) {
  console.log(temail);
  console.log("here123");

  const tuser = await getEntry(temail);

  const tentry = await emailMapActions.getEmailMap(temail);
  if (!tentry?.Item) {
    throw Error('emailMap_error');
  }
  const uname = tentry.Item.uname;
  if (!tuser?.Item) {
    throw Error('invalid email');
  }

  if (tuser.Item.code == scode) {
      console.log("matched");
      await _updateUser({
        TableName: 'WVUsers',
        Key: { uname },
        UpdateExpression: 'set isVerified = :p',
        ExpressionAttributeValues :{
          ':p': true
        },
        ReturnValues: 'UPDATED_NEW'
      });
      return "success";
  }
  else {
    throw Error("incorrect code");
  }

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
  sendEmail,
  sendVEmail,
  verifyCode,
};
