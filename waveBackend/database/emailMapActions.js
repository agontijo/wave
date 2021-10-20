const AWS = require('./awsconfig.js');

async function _getEmailMap(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  return await dc.get(params).promise();
}

async function _createEmailMap(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  return await dc.put(params).promise();
}

async function _deleteEmailMap(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  return await dc.delete(params).promise();
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

async function deleteEmailMap(email) {
  return await _deleteEmailMap({
    TableName: 'WVEmailMap',
    Key: {email},
    ConditionExpression: 'attribute_exists(email)'
  });
}


module.exports = {
  _getEmailMap,
  _createEmailMap,
  _deleteEmailMap,
  getEmailMap,
  isEmailAvailble,
  setEmailMap,
  deleteEmailMap,
};
