const express = require('express');
const axios = require('axios');

const isAuth = require('../../../middleware/isAuth.js');
const userActions = require('../../../database/userActions.js');
const spotifyUtil = require('../../../utils/spotifyUtils.js');

const router = express.Router();

router.get(
  '/genres',
  isAuth.isLoggedIn,
  isAuth.isSpotify,
  async (req, res) => {
    // console.log(req.user.spotifyTok.accessToken)
    try {
      const response = await axios.get('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.user.spotifyTok.accessToken}`
        }
      });
      res.send(response.data)
    } catch (e) {
      console.error(e);
      res.status(500).send('Something went wrong with spotify');
    }
  }
);


router.get(
  '/refresh',
  isAuth.isLoggedIn,
  isAuth.isSpotify,
  async (req, res) => {
    try {
      const newTok = await userActions.refreshSpotifyToks(req.user.uname, req.user.spotifyTok.refreshToken);
      res.send(newTok);
    } catch (e) {
      // console.error(e.response.data);
      console.error(e);
      res.status(500).send('Something went wrong with spotify');
    }
  }
);

router.get(
  '/search',
  isAuth.isLoggedIn,
  isAuth.isSpotify,
  async (req, res) => {
    if (!req.query.song) { res.status(422).send('missing song query parameter'); return; }
    try {
      const response = await axios.get(`https://api.spotify.com/v1/search?query=${req.query.song}&type=track&offset=0&limit=20`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.user.spotifyTok.accessToken}`
        }
      });
      res.send(response.data);
    } catch (e) {
      console.error(e)
      res.status(500).send('Something went wrong with spotify')
    }
  }
);

router.get(
  '/artist',
  isAuth.isLoggedIn,
  isAuth.isSpotify,
  async (req, res) => {
    if (!req.query.artist) { res.status(422).send('missing song query parameter'); return; }
    try {
      const response = await axios.get(`https://api.spotify.com/v1/artists/${req.query.artist}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.user.spotifyTok.accessToken}`
        }
      });
      res.send(response.data);
    } catch (e) {
      console.error(e)
      res.status(500).send('Something went wrong with spotify')
    }
  }
);


router.get(
  '/device',
  isAuth.isLoggedIn,
  isAuth.isSpotify,
  async (req, res) => {
    try {
      res.send(await spotifyUtil.getDevice(req.user.spotifyTok.accessToken));
    } catch (e) {
      console.error(e);
      res.send(500).send('Something went wrong with spotify device (Does token have correct permissions?)');
    }
  }
)

module.exports = router;