const axios = require('axios');

async function getTrack(song_id, access_token) {
  const response = await axios.get(`https://api.spotify.com/v1/tracks/${song_id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    }
  });
  return response.data;
}


module.exports = {
  getTrack,
};
