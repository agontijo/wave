const userActions = require('../database/userActions.js');

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/auth/failure');
  }
};

const isNotLoggedIn = (req, res, next) => {
  if (req.user) {
    res.redirect(`/api/user/${req.user.uname}`);
  } else {
    next();
  }
};

const isSpotify = async (req, res, next) => {
  // console.log(req.user);
  if (req.user?.spotifyTok?.refreshToken) {
    if (!req.user.spotifyTok.expireTime || req.user.spotifyTok.expireTime <= Date.now()) {
      console.log(req.user.spotifyTok.expireTime <= Date.now())
      const newAccess = await userActions.refreshSpotifyToks(
        req.user.uname,
        req.user.spotifyTok.refreshToken);
      // console.log(newAccess);
      req.user.spotifyTok.accessToken = newAccess;
    }
    next();
  } else {
    res.status(401).send('No spotify credentials');
  }
}

module.exports = {
  isLoggedIn,
  isNotLoggedIn,
  isSpotify,
};
