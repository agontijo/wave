const express = require('express');

const AWS = require('../../../database/awsconfig.js');

const router = express.Router();

router.get('/', (req, res) => {
  res.send("Add a user name to the path to look up a user");
});


// Get a user of with username = uname
router.get('/:uname', async (req, res) => {
  const dc = new AWS.DynamoDB.DocumentClient();
  await dc.get(
    {
      TableName: "WVUsers",
      Key: { uname: req.params.uname }
    },
    (err, data) => {
      if (err) { res.status(500).send(err.message); }
      else if (!('Item' in data)) { res.status(500).send(null) }
      else { res.send(data); }
    }
  );
});

module.exports = router;
