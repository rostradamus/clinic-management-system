require('module-alias/register');
const server = require('@root/server', {bustCache: true} );
global.chai = require("chai");
global.sinon = require("sinon");
global.chaiHttp = require("chai-http");
global.assert = chai.assert;
global.expect = chai.expect;
global.spy = sinon.spy;
global.stub = sinon.stub;

before(() => {
  global.server = server;
  chai.use(chaiHttp);
});

after((done) =>{
  server.close(() =>{
    delete require.cache[require.resolve('@root/server')];
    done();
  });
});
