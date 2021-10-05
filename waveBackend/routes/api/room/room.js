const express = require('express');

const roomActions = require('../../../database/roomActions.js');
const isAuth = require('../../../middleware/isAuth.js');

const router = express.Router();

router.get('/', (req, res) => {
    res.send("Add a user name to the path to look up a user");
  });
  
  // Get a room with roomID = roomid
  router.get(
    '/:roomid',
    isAuth.isLoggedIn, // Should we require a user to be logged in to get into a room?
    async (req, res) => {
      let data = null;
      try { data = await roomActions.getRoom(req.params.roomid); }
      catch (err) { res.send(500).send(err.message); }
      if (!data?.Item) { res.status(500).send('Could not find listening room in Database'); }
      res.status(200).send(data.Item);
    }
  );

  // Create a new room object - include room object params in the body
  router.post(
    '/create',
    isAuth.isLoggedIn,
    async (req, res) => {
      let data = null;
      try { data = await roomActions.createRoom(req.body); }
      catch (err) { res.send(500).send(err.message); }
      if (data) { res.status(200).send(data); }
      else { res.status(500).send(null); }
    }
  );

  router.post(
    '/:roomid/join',
    isAuth.isLoggedIn,
    async (req, res) => {
      try {
        const data = await roomActions.addUser(req.user.uname, req.params.roomid);
        if (data?.Attributes) { res.status(200).send(data); }
        else { res.status(500).send(null); }
      } catch (err) {
        res.status(500).send(err.message)
      }
    }
  );

  router.post(
    '/:roomid/leave',
    isAuth.isLoggedIn,
    async (req, res) => {
      try {
        const data = await roomActions.removeUser(req.user.uname, req.params.roomid);
        if (data?.Attributes) { res.status(200).send(data); }
        else { res.status(500).send(null); }
      } catch (err) {
        res.status(500).send(err.message)
      }
    }
  );

  router.post(
    '/:roomid/remove',
    isAuth.isLoggedIn,
    async (req, res) => {
      try {
        const data = await roomActions.destroyRoom(req.user.uname, req.params.roomid);
        if (data?.Attributes) { res.status(200).send(data); }
        else { res.status(500).send(null); }
      } catch (err) {
        res.status(500).send(err.message)
      }
    }
  );

module.exports = router;
