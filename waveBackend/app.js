require('dotenv').config();
const express = require('express');

const apiRouter = require('./routes/api/api.js');

const app = express();
const PORT = 3000;

app.use('/api', apiRouter);

app.get('/', (req, res) => { res.redirect('/api'); })

module.exports = app;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});
