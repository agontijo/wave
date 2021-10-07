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
    catch (err) { res.status(500).send(err.message); }
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
    console.log('1')
    try { data = await roomActions.createRoom(req.body); }
    catch (err) { res.sendStatus(500); }

    if (data) { res.status(200).send(data); }
    else { res.sendStatus(500) }
  }
);

// Add/remove from lists in the room object

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
  '/:roomid/addGenre',
  isAuth.isLoggedIn,
  async (req, res) => {
    try {
      const data = await roomActions.addUser(req.user.uname, req.params.roomid, req.body.genre);
      if (data?.Attributes) { res.status(200).send(data); }
      else { res.status(500).send(null); }
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
);

router.post(
  '/:roomid/removeGenre',
  isAuth.isLoggedIn,
  async (req, res) => {
    try {
      const data = await roomActions.removeUser(req.user.uname, req.params.roomid, req.body.genre);
      if (data?.Attributes) { res.status(200).send(data); }
      else { res.status(500).send(null); }
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
);

// Delete the room object from the DB

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

// Setters for various field in the room object

router.post(
  '/:roomid/roomname',
  isAuth.isLoggedIn,
  async (req, res) => {
    try {
      const data = await roomActions.setRoomName(req.user.uname, req.params.roomid, req.body.roomName);
      if (data?.Attributes) { res.status(200).send(data); }
      else { res.status(500).send(null); }
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
);

router.post(
  '/:roomid/songthreshold',
  isAuth.isLoggedIn,
  async (req, res) => {
    try {
      const data = await roomActions.setThreshold(req.user.uname, req.params.roomid, req.body.songThreshold);
      if (data?.Attributes) { res.status(200).send(data); }
      else { res.status(500).send(null); }
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
);

router.post(
  '/:roomid/allowexplicit',
  isAuth.isLoggedIn,
  async (req, res) => {
    try {
      const data = await roomActions.setAllowExplicit(req.user.uname, req.params.roomid, req.body.allowExplicit);
      if (data?.Attributes) { res.status(200).send(data); }
      else { res.status(500).send(null); }
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
);

module.exports = router;
