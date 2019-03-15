require('module-alias/register');
const chai = require("chai");
const assert = chai.assert;

describe('server process conflict test', () => {
  let server;
  let queryManager;

  before(() => {
    server = require('../server', {bustCache: true} );
  });

  beforeEach(() => {
    queryManager = require('@app/helpers/queryManager');
  });

  after((done) => {
    server.close(done);
  });

  it('server should run and close without any conflict', () => {
    let arr = [];
    assert.equal(arr.length, 0);
  });
});


