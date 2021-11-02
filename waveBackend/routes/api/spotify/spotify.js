const express = require('express');
const axios = require('axios');

const isAuth = require('../../../middleware/isAuth.js');
const userActions = require('../../../database/userActions.js')

const router = express.Router();

router.get(
  '/genres',
  isAuth.isLoggedIn,
  isAuth.isSpotify,
  async (req, res) => {
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


module.exports = router;