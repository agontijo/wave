const AWS = require('./awsconfig.js')

async function _updateUser(params) {
  const dc = new AWS.DynamoDB.DocumentClient();
  return await dc.update(params).promise()
}


async function setUserDisplayName(uname, displayName) {
  return await _updateUser({
    TableName: 'WVUsers',
    Key: { uname },
    UpdateExpression: 'set displayName = :d',
    ExpressionAttributeValues: {
      ':d': displayName
    },
    ReturnValues: 'UPDATED_NEW'
  });
}

module.exports = {
  _updateUser,
  setUserDisplayName,
};
