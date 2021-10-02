const express = require('express');

const AWS = require('../../../database/awsconfig.js');
const userActions = require('../../../database/userActions.js');
const isAuth = require('../../../middleware/isAuth.js');

const router = express.Router();

router.get('/', (req, res) => {
  res.send("Add a user name to the path to look up a user");
});


// Get a user of with username = uname
router.get(
  '/:uname',
  isAuth.isLoggedIn,
  (req, res) => {
    if (req.params.uname !== req.user.uname) {
      res.status(403).send('Forbidden!');
    } else {
      const dc = new AWS.DynamoDB.DocumentClient();
      dc.get(
        {
          TableName: "WVUsers",
          Key: { uname: req.params.uname }
        },
        (err, data) => {
          if (err) { res.status(500).send(err.message); }
          else if (!data?.Item) { res.status(500).send(null) }
          else { res.send(data); }
        }
      );
    }
  }
);

router.post(
  '/:uname/displayname',
  isAuth.isLoggedIn,
  async (req, res) => {
    if (req.params.uname !== req.user.uname) {
      res.status(403).send('Forbidden!');
      return
    }
    try {
      const data = await userActions.setUserDisplayName(
        req.user.uname,
        req.body.displayName
      );
      if (data?.Attributes) { res.status(200).send(data); }
      else { res.status(500).send(null); }
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
);

router.post(
  '/:uname/password',
  isAuth.isLoggedIn,
  async (req, res) => {
    if (req.params.uname !== req.user.uname) {
      res.status(403).send('Forbidden!');
      return
    }
    try {
      const data = await userActions.setUserPassword(
        req.user.uname,
        req.body.password
      );
      if (data?.Attributes) { res.status(200).send(data); }
      else { res.status(500).send(null); }
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
);

module.exports = router;
