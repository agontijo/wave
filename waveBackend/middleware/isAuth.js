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

const isSpotify = (req, res, next) => {
  // console.log(req.user);
  if (req.user?.spotifyTok?.accessToken) {
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
