require('dotenv').config();
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/api', (req, res) => {
  res.send('Hello World');
});

app.get('/', (req, res) => { res.redirect('/api'); })

module.exports = app;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});
