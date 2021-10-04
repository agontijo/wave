const passport = require('passport');
const LocalStrategy = require('passport-local');

const uA = require('../database/userActions');

const SpotifyStrategy = require('passport-spotify').Strategy;

const AWS = require('../database/awsconfig.js');

passport.serializeUser((user, done) => done(null, user.uname));
passport.deserializeUser(async (uname, done) => {
  const dc = new AWS.DynamoDB.DocumentClient();
  let found = null;
  try {
    found = await dc.get(
      {
        TableName: 'WVUsers',
        Key: { uname }
      },
    ).promise();
  } catch (err) {
    return done(err, false);
  }
  if (found?.Item) { return done(null, found.Item) }
  return done(null, false);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (uname, pswrd, done) => {
      const dc = new AWS.DynamoDB.DocumentClient();
      let found = null;
      try {
        found = await dc.get({
          TableName: 'WVUsers',
          Key: { uname }
        }).promise();
      } catch (err) {
        return done(err, false);
      }
      if (found?.Item?.pswd === pswrd) {
        return done(null, found.Item);
      }
      return done(null, false);
    }
  )
);

passport.use(
  'register',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, uname, pswd, done) => {
      let user = null;
      try {
        if (
          !uname ||
          !pswd ||
          !req?.body?.email
        ) {
          throw 'Malformed User Object!';
        }
        user = {
          uname,
          pswd,
          email: req.body.email,
          displayName: req.body?.displayName ?? 'Wave User'
        };
        const dc = new AWS.DynamoDB.DocumentClient();
        inserted = await dc.put({
          TableName: 'WVUsers',
          ConditionExpression: 'attribute_not_exists(uname)',
          Item: user,
        }).promise();
      } catch (err) {
        return done(err, false);
      }
      return done(null, user)
    }
  )
);

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/user/spotcallback',
      passReqToCallback: true,
    },
    function (req, accessToken, refreshToken, expires_in, profile, done) {
      // asynchronous verification, for effect...
      //process.nextTick(function () {})
      console.log(req.user);
    }
  )
);