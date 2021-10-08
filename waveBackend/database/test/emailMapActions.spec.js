const chai = require('chai');
const assert = chai.assert;

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const EMA = require('../emailMapActions.js');
const generate = require('../../utils/generators.js');

describe('Email Map Actions', function () {
  describe('isEmailAvailble', function () {
    it('Identifies that `myfakeemail@email.gov` is currently in use', async function () {
      assert.isFalse(await EMA.isEmailAvailble('myfakeemail@email.gov'));
    });

    it('Identifies that `myfakeemail@email.gov` is available to user `testuser` who has the email attached to account', async function () {
      assert.isTrue(await EMA.isEmailAvailble('myfakeemail@email.gov', 'testuser'));
    });

    it('Identifies that a new random email is not currently in use', async function () {
      assert.isTrue(await EMA.isEmailAvailble(`randemail${generate.eightDigitHexID()}@fakeemail.test`));
    });
  });

  describe('getEmailMap', function () {
    it('Returns the Email Map object when getting email that exisits (`myfakeemail@email.gov`)', async function () {
      const email = 'myfakeemail@email.gov'
      const emailMap = (await EMA.getEmailMap(email)).Item;
      assert.equal(emailMap.email, email);
    });

    it('Email Map object returned is tied to the user with the speicfied email (`testuser`)', async function () {
      const email = 'myfakeemail@email.gov'
      const emailMap = (await EMA.getEmailMap(email)).Item;
      assert.equal(emailMap.uname, 'testuser');
    });

    it('Map object is undef if the requested email does not exist in the map', async function () {
      assert.isUndefined(await EMA.isEmailAvailble(`randemail${generate.eightDigitHexID()}@fakeemail.test`).Item);
    })
  });
});