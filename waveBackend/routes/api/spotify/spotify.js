const express = require('express');
const axios = require('axios');

const isAuth = require('../../../middleware/isAuth.js');

const router = express.Router();

router.get(
  '/genres',
  isAuth.isLoggedIn,
  isAuth.isSpotify,
  async (req, res) => {
    try {
      console.log('yo')
      const response = await axios.get('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.user.spotifyTok.accessToken}`
        }
      })
      console.log(response);
      res.send(response.data)
    } catch (e) {
      console.error(e);
      res.status(500).send('Something went wrong with spotify');
    }
  }
);

module.exports = router;