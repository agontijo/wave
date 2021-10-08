const chai = require('chai');
const assert = chai.assert;

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const UA = require('../userActions.js');
const generate = require('../../utils/generators.js');

describe('User Actions', function () {
  describe('Able to GET an existing user', function () {
    it('Successfully finds and returns user object for user `testuser`', async function () {
      const uname = 'testuser';
      const user = (await UA.getUser(uname)).Item;
      assert.equal(user.uname, uname);
    });
  });

  describe('Able to SET an existing user', function () {
    it('Successfully changes the display name of user `testuser` to a new random string', async function () {
      const newDisplayName = `TestUser - ${generate.eightDigitHexID()}`;
      const updatedUser = (await UA.setUserDisplayName('testuser', newDisplayName)).Attributes;
      assert.equal(updatedUser.displayName, newDisplayName);
    });
  });

  describe('Correct parameters must be passed when attempting to CREATE a user', function () {
    it('Does error out if no uname is provided for the new user', async function () {
      let thrown = false;
      try {
        await UA.createUser({
          password: 'password',
          email: 'email@email.com'
        });
      } catch (err) {
        thrown = true;
      }
      assert.isTrue(thrown);
    });

    it('Does error out if the no password is provided for the new user', async function () {
      let thrown = false;
      try {
        await UA.createUser({
          username: 'username',
          email: 'email@email.com'
        });
      } catch (err) {
        thrown = true;
      }
      assert.isTrue(thrown);
    });

    it('Does error out if there is no new email assigned to the new user', async function () {
      let thrown = false;
      try {
        await UA.createUser({
          username: 'username',
          password: 'password',
        });
      } catch (err) {
        thrown = true;
      }
      assert.isTrue(thrown);
    });
  });

  describe('User is only created with correct unique criteria', function() {
    it('Does not create a user if the uname is already used', async function () {
      let thrown = false;
      try {
        await UA.createUser({
          username: 'testuser',
          password: 'password',
          email: `testemail${generate.eightDigitHexID()}@test.test`
        });
      } catch (err) {
        thrown = true;
      }
      assert.isTrue(thrown);
    });

    it('Does not create a user if the email is already used', async function () {
      let thrown = false;
      try {
        await UA.createUser({
          username: `testuser${generate.eightDigitHexID()}`,
          password: 'password',
          email: 'myfakeemail@email.gov'
        });
      } catch (err) {
        thrown = true;
      }
      assert.isTrue(thrown);
    });
  });
});
