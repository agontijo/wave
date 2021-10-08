const chai = require('chai');
const assert = chai.assert;

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const lPP = require('../loginPreProcess.js');
const isEmail = require('../../utils/regexValidation').looksLikeEmail;

describe('loginPreProcess Module', function () {
  describe('resolveUname', function () {
    it('Can recogize a string that looks like an email', function () {
      assert.isTrue(isEmail('matthew.drozt@gmail.com'));
    });

    it('Can recoginize a string that does not look like an email', function () {
      assert.isFalse(isEmail('NotAnEmail'));
    });

    it('Correctly resolves an email in the database to the uname', async function () {
      const req = {
        body: {
          username: "myfakeemail@email.gov",
        }
      };
      const res = {}
      const next = () => { }

      await lPP.resolveUname(req, res, next);
      assert.equal(req.body.username, 'testuser');
    });

    it('Leaves a username as is if it cannot be resolved', async function () {
      const req = {
        body: {
          username: "EMAIL_NOT_IN_DB@email.gov",
        }
      };
      const res = {}
      const next = () => { }

      await lPP.resolveUname(req, res, next);
      assert.equal(req.body.username, 'EMAIL_NOT_IN_DB@email.gov');
    });
  });
});