require('dotenv').config();
const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');

const apiRouter = require('./routes/api/api.js');
const authRouter = require('./routes/auth/auth.js');
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
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => { res.redirect('/api'); })

module.exports = app;



// TODO: REMOVE BELLOW
app.get('/spot', passport.authenticate('spotify'));
app.get('/callback', (req, res) => res.send(':)'));
// TODO: REMOVE ABOVE

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});
