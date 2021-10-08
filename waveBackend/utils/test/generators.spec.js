const chai = require('chai');
const assert = chai.assert;

const gen = require('../generators.js');

describe('Random Generators', function () {
  describe('Eight Digit Hex ID', function () {
    it('Generates an ID of length 8', function () {
      assert.equal(gen.eightDigitHexID().length, 8);
    });

    it('Looks like Hex', function () {
      assert.isTrue(/^[a-fA-F0-9]+$/.test(gen.eightDigitHexID()));
    });

    it('Does not make consecutive equal IDs', function () {
      assert.notEqual(
        gen.eightDigitHexID(),
        gen.eightDigitHexID()
      );
    });
  });
});