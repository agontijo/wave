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
  isAuth.isSpotify,
  async (req, res) => {
    let data = null;
    try {
      // TODO: Make this if its own function
      if (req.user.currRoom !== "") {
        try { roomActions.destroyRoom(req.user.uname, req.user.currRoom); }
        catch (err) { console.error(err); }
      }
      data = await roomActions.createRoom(req.body);
    } catch (err) { res.sendStatus(500); }

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
      console.error(err);
      res.status(500).send(err.message);
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
      const data = await roomActions.setRoomName(req.user.uname, req.params.roomid, req.body.name);
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

router.post(
  '/:roomid/song',
  isAuth.isLoggedIn,
  async (req, res) => {
    try {
      const data = await roomActions.addSong(req.params.roomid, req.body.songID);
      console.log(data);
      res.send(data);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

router.get(
  '/:roomid/nextsong',
  isAuth.isLoggedIn,
  async (req, res) => {
    const room = (await roomActions.getRoom(req.params.roomid)).Item;
    if (!room?.RoomID) {
      res.status(410).send('Could not find room, likely gone');
      return;
    }
    if (req.user.uname !== room.host) {
      res.status(403).send('Only the host can pop the next song off of the queue');
      return;
    }
    try {
      const song = await roomActions.popSongFromQueue(room.RoomID);
      if (song === -1) {
        res.status(404).send('No song avalible')
      } else {
        res.send(song);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Had trouble getting song from queue');
    }
  }
);

router.post(
  '/:roomid/likesong',
  isAuth.isLoggedIn,
  async (req, res) => {
    try {
      const data = await roomActions.upvoteSong(req.params.roomid, req.body.songID, req.user.uname);
      res.send(data);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

router.post(
  '/:roomid/dislikesong',
  isAuth.isLoggedIn,
  async (req, res) => {
    try {
      const data = await roomActions.downvoteSong(req.params.roomid, req.body.songID, req.user.uname);
      res.send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }
);

router.post(
  '/:roomid/endsong',
  isAuth.isLoggedIn,
  async (req, res) => {
    try {
      const data = await roomActions.moveSongToPrev(req.params.roomid, req.body.song, req.user.uname);
      res.send(data);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

module.exports = router;
