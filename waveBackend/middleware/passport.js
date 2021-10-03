const passport = require('passport');
const LocalStrategy = require('passport-local');

const userActions = require('../database/userActions.js');

passport.serializeUser((user, done) => done(null, user.uname));
passport.deserializeUser(async (uname, done) => {
  let found = null;
  try { found = await userActions.getUser(uname); }
  catch (err) { return done(err, false); }
  if (found?.Item) { return done(null, found.Item) }
  return done(null, false);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      let found = null;
      try { found = await userActions.getUser(username); }
      catch (err) { return done(err, false); }
      if (found?.Item?.pswd === password) { return done(null, found.Item); }
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
    async (req, username, password, done) => {
      let user = null;
      try {
        user = await userActions.createUser({
          username,
          password,
          email: req?.body?.email,
          displayName: req?.body?.displayName,
        });
      } catch (err) { return done(err, false); }
      return done(null, user)
    }
  )
);