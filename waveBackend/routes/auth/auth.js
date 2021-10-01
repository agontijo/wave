var express = require("express");
var passport = require("passport");

const router = express.Router();

router.get('/local', (req, res) => {
  res.send('Maybe try posting some credentials!');
});

router.post(
  '/local',
  passport.authenticate('local'),
  (req, res) => {
    if (!req.user) {
      res.status(401);
      res.send("Username or password incorrect");
    }
    res.status(200).send(req.user);
  }
);

module.exports = router;
