const express = require('express');
const userRouter = require('./user/user.js');

const router = express.Router();

router.use('/user', userRouter);

router.get('/', (req, res) => {
  res.send('Hello from the API!');
});

module.exports = router;