const express = require('express');
const userRouter = require('./user/user.js');
const roomRouter = require('./room/room.js');

const router = express.Router();

router.use('/user', userRouter);
router.use('/room', roomRouter);

router.get('/', (req, res) => {
  res.send('Hello from the API!');
});

module.exports = router;
