const express = require('express');

const userActions = require('../../../database/userActions.js');
const isAuth = require('../../../middleware/isAuth.js');

const router = express.Router();

// Get a user of with username = uname
router.get('/', (req, res) => {
  if (req.user) { res.send(req.user); }
  else { res.send(null); }
})
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


router.post(
  '/:uname/deleteaccount',
  isAuth.isLoggedIn,
  async (req, res) => {
    if (req.params.uname !== req.user.uname) {
      res.status(403).send('Forbidden!');
      return
    }
    try {
      await userActions.deleteUser(req.user.uname);
      res.redirect('/');
      // res.sendStatus(204);
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
);

// TODO: Fix or remove!!

// router.get(
//   '/:uname/spotifytok',
//   isAuth.isLoggedIn,
//   // passport.authenticate('spotify'),
//   async (req, res) => {
//     if (req.params.uname !== req.user.uname) {
//       res.status(403).send('Forbidden!');
//       return
//     }
//     try {
//       const data = await userActions.setSpotifyToks(
//         req.user.uname,
//         'tokA',
//         'tokB'
//       );
//       if (data?.Attributes) { res.status(200).send(data); }
//       else { res.status(500).send(null); }
//     } catch (err) {
//       res.status(500).send(err.message)
//     }
//   }
// );

module.exports = router;
