const express = require("express");
const passport = require("passport");

const isAuth = require('../../middleware/isAuth.js');
const loginPreProc = require('../../middleware/loginPreProcess.js');

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
  isAuth.isNotLoggedIn,
  passport.authenticate('register'),
  (req, res) => {
    if (!req.user) {
      res.status(500).send('Failded to create user');
    }
    res.status(200).send(req.user);
  }
);

// SPOTIFY
router.get('/spotify', passport.authenticate('spotify'));
router.get(
  '/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/auth/failure'}),
  (req, res) => res.send('successfully got spotify stuff!!')
);

// BORING STUFF
router.get('/failure', (req, res) => res.status(401).send("Not Authenticated!"));
router.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});

module.exports = router;
