const passport = require('passport');
const LocalStrategy = require('passport-local');
const SpotifyStrategy = require('passport-spotify').Strategy;

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
      if(found?.Item.isVerified == false ) { return done(null, false);}
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
          host: req.get('host'),
        });
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
      callbackURL: `${process.env.SPOTIFY_CALLBACK_URI}/auth/spotify/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, expires_in, profile, done) => {
      try {
        if (!req?.user) { throw 'No user signed in to attach credentials'; }
        const expireTime = expires_in * 1000 + Date.now();
        req.user.spotifyTok = { accessToken, refreshToken, expireTime };
        await userActions.setSpotifyToks(req.user.uname, accessToken, refreshToken, expireTime);
      } catch (err) { return done(err, false); }
      return done(null, req.user)
    }
  )
);