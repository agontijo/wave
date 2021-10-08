const chai = require('chai');
const assert = chai.assert;

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const RA = require('../roomActions.js');
const generate = require('../../utils/generators.js');

describe('Room Actions', function () {
  describe('Able to GET an existing room', function () {
    it('Successfully finds and returns the user object room object for `9eec5a64`', async function () {
      const id = '9eec5a64';
      const room = (await RA.getRoom(id)).Item;
      assert.equal(room.RoomID, id);
    });
  });

  describe('Able to SET an existing room', function () {
    it('Successfully changes the room name of room `9eec5a64` to a new random string', async function () {
      const newRoomName = `TestUser - ${generate.eightDigitHexID()}`
      const updatedRoom = (await RA.setRoomName('testuser', '9eec5a64', newRoomName)).Attributes;
      assert.equal(updatedRoom.roomname, newRoomName);
    });

    it('Successfully changes the `allow excplit` parameter of room `9eec5a64` to opposite of current value', async function () {
      const id = '9eec5a64';
      const newAllowEx = !(await RA.getRoom(id)).Item?.allowExplicit;
      const updatedRoom = (await RA.setAllowExplicit('testuser', id, newAllowEx)).Attributes;
      assert.equal(updatedRoom.allowExplicit, newAllowEx);
    });
  });

  describe('Correct parameters are required when creating a room', function () {
    it('Requires a host uname to be passed as a parameter', async function () {
      let thrown = false;
      try { await RA.createRoom({}); }
      catch (err) { thrown = true; }
      assert.isTrue(thrown);
    });
  });
});