require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cookieSession = require('cookie-session');

const apiRouter = require('./routes/api/api.js');
const authRouter = require('./routes/auth/auth.js');
const roomRouter = require('./routes/api/room/room.js')
require('./middleware/passport.js');

const app = express();
const PORT = 3000;

// parse things
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// init cookies
app.use(cookieSession({
  name: "WaveSession",
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['TruelyInspiredAndAwesomeCookieKey'],
}));

// init passport
app.use(session({
  secret: 'WaveSessionSecretString',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use('/room', roomRouter);

app.get('/', (req, res) => { res.redirect('/api'); })

module.exports = app;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});
