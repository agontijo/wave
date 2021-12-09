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
    console.log(req.body);
    if (!req.user) {
      res.status(401).send("Username or password incorrect or email unverified");
    }
    //if (req.user.isVerified == false) { res.status(401).send("Email not verified");}
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

router.post(
  '/resetpassword',
  async (req, res) => {
    console.log(req.body.username);
    try {
      await userActions.sendEmail(req.body.username);
      res.status(200).send("mailsent");
      /*if (check == "error"){
        res.status(500).send("error_in_send");
        console.log("error_send");
      }
      else {
        console.log("success_send");
        res.status(200).send("success_send");
      }*/
      //res.redirect('/');
    } catch (err) { 
      console.log("someerror;");
      console.log(err);
      res.status(422).send(err);
    }
  }
);

router.post(
  '/checkemail',
  async (req, res) => {
    console.log(req.body.username);
    try {
      await userActions.sendVEmail(req.body.username, req.get('host'));
      res.status(200).send("sucess");
    } catch (err) {
      console.log(err);
      res.status(422).send(err)
    }
  }
);


router.get(
  '/verify',
  async (req, res) => {
    console.log(req.protocol+"://"+req.get('host'));
    console.log(req.query.id, req.query.email);
    try {
      var check = await userActions.verifyCode(req.query.id, req.query.email);
      console.log(check)
      res.status(200).send(check);
    } catch (err) {
      res.status(422).send(err);
    }
  }
)
module.exports = router;
