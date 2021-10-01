const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-2',
  credentials: new AWS.Credentials({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  })
});

module.exports = AWS;
