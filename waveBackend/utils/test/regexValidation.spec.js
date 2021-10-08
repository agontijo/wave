const chai = require('chai');
const assert = chai.assert;

const RV = require('../regexValidation');

describe('Regex Validators', function () {
  describe('Can Recognize an Email Address', function () {
    it('Recognizes `mdrozt@purdue.edu` as an email address', function () {
      assert.isTrue(RV.looksLikeEmail('mdrozt@purdue.edu'));
    });

    it('Recognizes `matthew.drozt@gmail.com` as an email address', function () {
      assert.isTrue(RV.looksLikeEmail('matthew.drozt@gmail.com'));
    });

    it('Recognizes `matt@matt` as NOT an email address', function () {
      assert.isFalse(RV.looksLikeEmail('matt@matt'));
    });
  });
});