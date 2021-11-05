const axios = require('axios');

async function _getWithAccessToken(uri, access_token) {
  return await axios.get(uri, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    }
  });
}

async function _putWithAccessToken(uri, data, access_token) {
  const yo = `Bearer ${access_token}`;
  console.log(yo);
  return await axios.put(uri, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': yo
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

async function getDevice(access_token) {
  return (await _getWithAccessToken(
    'https://api.spotify.com/v1/me/player/devices',
    access_token
  )).data;
}

async function playOnDevice(device_id, uris, access_token) {
  return await _putWithAccessToken(
    `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
    {
      "uris": uris,
      "offset": {
        "position": 0
      },
      "position_ms": 0
    },
    access_token
  );
}

module.exports = {
  getTrack,
  getArtist,
  getDevice,
  playOnDevice,
};
