const axios = require('axios');

async function _getWithAccessToken(uri, access_token) {
  return await axios.get(uri, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    }
  });
}

async function getTrack(song_id, access_token) {
  return (await _getWithAccessToken(
    `https://api.spotify.com/v1/tracks/${song_id}`,
    access_token
  )).data;
}


async function getArtist(artist_id, access_token) {
  return (await _getWithAccessToken(
    `https://api.spotify.com/v1/artists/${artist_id}`,
    access_token
  )).data;
}

module.exports = {
  getTrack,
  getArtist,
};
