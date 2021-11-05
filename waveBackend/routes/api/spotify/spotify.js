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

router.put(
  '/volume',
  isAuth.isLoggedIn,
  isAuth.isSpotify,
  async (req, res) => {
    console.log('yo');
    if (!req.query.vol) {res.status(422).send('missing volume parameter'); return; }
    try {

      //console.log(req.query.vol);
      //console.log(req.body.device);

      const host = await userActions.getUser(req.query.host);
      console.log(host);
      return


      // axios.defaults.headers.common['Authorization'] = `Bearer ${req.user.spotifyTok.accessToken}`;

      await axios.put(`https://api.spotify.com/v1/me/player/volume?volume_percent=${req.query.vol}&device_id=${req.body.device}`, {}, 
        {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.user.spotifyTok.accessToken}`
      });

      res.sendStatus(204);
      //res.send(response.data);
    } catch (e) {
      console.error(e)
      res.status(500).send('Something wrong with spotify volume change')
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
      res.status(500).send('Something went wrong with spotify device (Does token have correct permissions?)');
    }
  }
);

router.put(
  '/play',
  isAuth.isLoggedIn,
  isAuth.isSpotify,
  async (req, res) => {
    try {
      await spotifyUtil.playOnDevice(
        req.body.device,
        req.body.uris,
        req.user.spotifyTok.accessToken
      )
      res.sendStatus(204);
    } catch (e) {
      console.error(e);
      res.status(500).send('Something went wrong with spotify play (Does token have correct permissions?)')
    }
  }
)

module.exports = router;