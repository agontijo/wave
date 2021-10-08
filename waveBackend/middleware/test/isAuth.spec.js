const chai = require('chai');
const assert = chai.assert;

const isAuth = require('../isAuth.js');

describe('isAuth Module', function () {
  describe('isLoggedIn middleware', function () {
    it('Allows a `req` with a `user` property to pass', function () {
      let nextCalled = false;
      const req = { user: {} };
      const res = { redirect: () => { throw 'Incorrect redirect!' } };
      const next = () => { nextCalled = true; };
      isAuth.isLoggedIn(req, res, next);
      assert.isTrue(nextCalled);
    });

    it('Redirects `req` w/o a `user` property', function () {
      let redirected = false;
      const req = {};
      const res = { redirect: (x) => { redirected = true } };
      const next = () => { throw 'Should not allow request to pass' };
      isAuth.isLoggedIn(req, res, next);
      assert.isTrue(redirected);
    })
  });

  describe('isNotLoggedIn middleware', function () {
    it('Allows a `req` w/o a `user` property to pass', function () {
      let nextCalled = false;
      const req = {};
      const res = { redirect: () => { throw 'Incorrect redirect!' } };
      const next = () => { nextCalled = true; };
      isAuth.isNotLoggedIn(req, res, next);
      assert.isTrue(nextCalled);
    });

    it('Sends back a user object when `req` has a `user` porperty', function () {
      let redirected = false;
      const req = { user: { uname: 'testuser' } };
      const res = { redirect: (x) => { redirected = x } };
      const next = () => { throw Error('Should not allow request to pass'); };
      isAuth.isNotLoggedIn(req, res, next);
      assert.equal(redirected, '/api/user/testuser');
    })
  });
});