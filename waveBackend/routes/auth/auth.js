const express = require("express");
const passport = require("passport");

const isAuth = require('../../middleware/isAuth.js');
const loginPreProc = require('../../middleware/loginPreProcess.js');
const userActions = require('../../database/userActions.js');
const emailMapActions = require('../../database/emailMapActions.js');

const router = express.Router();

// LOCAL ACCOUNTS
router.get('/local', (req, res) => {
  const body = "{\n  username: ...,\n  password: ...,\n}";
  res.send(`Expecting a POST request with body:\n${body}`);
});

router.post(
  '/local',
  isAuth.isNotLoggedIn,
  loginPreProc.resolveUname,
  passport.authenticate('local'),
  (req, res) => {
    if (!req.user) {
      res.status(401).send("Username or password incorrect");
    }
    res.status(200).send(req.user);
  }
);

router.get('/local/register', (req, res) => {
  const body = "{\n  username: ...,\n  password: ...,\n  email: ...,\n displayName: [OPTIONAL]\n}";
  res.send(`Expecting a POST request with body:\n${body}`);
})

router.post(
  '/local/register',
  (req, res, next) => {
    if (!(
      req.body.username &&
      req.body.password &&
      req.body.email
    )) {
      res.status(422).send('Malformed User Object!');
    } else {
      return next();
    }
  },
  async (req, res, next) => {
    if (!(await emailMapActions.isEmailAvailble(req.body.email, req.body.username))) {
      res.status(409).send('Email is not unique!');
    } else {
      return next();
    }
  },
  async (req, res, next) => {
    const existing = await userActions.getUser(req.body.username);
    if (existing?.Item) {
      res.status(409).send('Username is not unique');
    } else {
      return next();
    }
  },
  isAuth.isNotLoggedIn,
  passport.authenticate('register'),
  (req, res) => {
    if (!req.user) {
      res.status(500).send('Could not create user');
    }
    res.status(200).send(req.user);
  }
);

// SPOTIFY
router.get(
  '/spotify',
  isAuth.isLoggedIn,
  passport.authenticate('spotify', {
    scope: ['user-read-playback-state', 'user-modify-playback-state'],
  })
);

router.get(
  '/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    if (!req.user) { res.status(500).send('Failded to attach spotify credentials to user'); }
    else { res.redirect('/homepage'); }
  }
);

router.get(
  '/spotify/disconnect',
  isAuth.isLoggedIn,
  async (req, res) => {
    try {
      await userActions.clearSpotifyToks(req.user.uname);
      res.redirect('/homepage');
    } catch (err) { res.status(500).send(err); }
  }
)

// BORING STUFF
router.get('/failure', (req, res) => res.status(401).send("Not Authenticated!"));
router.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});

module.exports = router;
