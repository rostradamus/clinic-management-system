require('module-alias/register');
const chai = require("chai");
const assert = chai.assert;

describe('queryManager', () => {
  let server;
  let queryManager;

  before(() => {
    server = require('../server', {bustCache: true} );
  });

  beforeEach(function() {
    queryManager = require('@app/helpers/queryManager');
  });

  after((done) =>{
    server.close(() =>{
      // This is used to remove require('../server') from cache so that it will not affect other tests
      delete require.cache[require.resolve('../server')];
      done();
    });
  });

  it('getBaseQuery', () => {
    let arr = [];
    assert.equal(arr.length, 0);
  });
});


