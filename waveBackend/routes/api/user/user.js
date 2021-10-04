const express = require('express');
const passport = require('passport');

const userActions = require('../../../database/userActions.js');
const isAuth = require('../../../middleware/isAuth.js');

const router = express.Router();

router.get('/', (req, res) => {
  res.send("Add a user name to the path to look up a user");
});


// Get a user of with username = uname
router.get(
  '/:uname',
  isAuth.isLoggedIn,
  async (req, res) => {
    if (req.params.uname !== req.user.uname) {
      res.status(403).send('Forbidden!');
    } else {
      let data = null;
      try { data = await userActions.getUser(req.user.uname); }
      catch (err) { res.send(500).send(err.message); }
      if (!data?.Item) { res.status(500).send('Could not find user in Database'); }
      res.status(200).send(data.Item);
    }
  }
);

router.post(
  '/:uname/displayname',
  isAuth.isLoggedIn,
  async (req, res) => {
    if (req.params.uname !== req.user.uname) {
      res.status(403).send('Forbidden!');
      return
    }
    try {
      const data = await userActions.setUserDisplayName(
        req.user.uname,
        req.body.displayName
      );
      if (data?.Attributes) { res.status(200).send(data); }
      else { res.status(500).send(null); }
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
);

router.post(
  '/:uname/password',
  isAuth.isLoggedIn,
  async (req, res) => {
    if (req.params.uname !== req.user.uname) {
      res.status(403).send('Forbidden!');
      return
    }
    try {
      const data = await userActions.setUserPassword(
        req.user.uname,
        req.body.password
      );
      if (data?.Attributes) { res.status(200).send(data); }
      else { res.status(500).send(null); }
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
);

router.get(
  '/:uname/spotifytok',
  // isAuth.isLoggedIn,
  passport.authenticate('spotify')
  // async (req, res) => {
  //   if (req.params.uname !== req.user.uname) {
  //     res.status(403).send('Forbidden!');
  //     return
  //   }
  //   try {
  //     const data = await userActions.setUserSpotifyTok(
  //       req.user.uname,
  //       req.body.spotifyTok
  //     );
  //     if (data?.Attributes) { res.status(200).send(data); }
  //     else { res.status(500).send(null); }
  //   } catch (err) {
  //     res.status(500).send(err.message)
  //   }
  // }
);

// TODO: Remove this!!
router.get(
  '/callback',
  (res, req) => {
    res.send('HERE!!');
  }
)

module.exports = router;
