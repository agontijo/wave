const passport = require('passport');
const LocalStrategy = require('passport-local');

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