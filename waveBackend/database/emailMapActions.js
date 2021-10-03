const AWS = require('./awsconfig.js');

async function _getEmailMap(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  return await dc.get(params).promise();
}

async function _createEmailMap(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  return await dc.put(params).promise();
}

async function getEmailMap(email) {
  return await _getEmailMap({
    TableName: 'WVEmailMap',
    Key: { email },
  });
}

async function isEmailAvailble(email, forUser = null) {
  const map = (await getEmailMap(email))?.Item;
  if (map?.email && map?.uname !== forUser) { 
    return false;
  }
  return true;
}

async function setEmailMap(email, uname) {
  return await _createEmailMap({
    TableName: 'WVEmailMap',
    Item: { email, uname },
  });
}

module.exports = {
  _getEmailMap,
  _createEmailMap,
  getEmailMap,
  isEmailAvailble,
  setEmailMap,
};
