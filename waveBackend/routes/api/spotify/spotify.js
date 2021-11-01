const express = require('express');
const axios = require('axios');
const qs = require('qs');

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
      })
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
      const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: qs.stringify({
          'grant_type': 'refresh_token',
          'refresh_token': req.user.spotifyTok.refreshToken
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')}`
        }
      });

      // console.log(response.data.access_token);
      userActions.setSpotifyToks(req.user.uname, response.data.access_token, req.user.spotifyTok.refreshToken);
      res.send(req.user);
    } catch (e) {
      // console.error(e.response.data);
      console.error(e);
      res.status(500).send('Something went wrong with spotify');
    }
  }
);


module.exports = router;