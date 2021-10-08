const chai = require('chai');
const assert = chai.assert;

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

describe('AWS Configuration', function () {
  it('Can correclty establish a connection with DynamoDB', function () {
    require('../awsconfig.js');
  })
});