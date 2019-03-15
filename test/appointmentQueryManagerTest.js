require('module-alias/register');
const chai = require("chai");
const sinon = require("sinon");
let { assert, expect } = chai;
let { spy } = sinon;

describe('appointmentQueryManager unit test', () => {
  let server;
  let appointmentQueryManager;

  before(() => {
    server = require('../server', {bustCache: true} );
    appointmentQueryManager = require('@app/helpers/queryManager/appointment');
  });

  after((done) =>{
    server.close(() =>{
      // This is used to remove require('../server') from cache so that it will not affect other tests
      delete require.cache[require.resolve('../server')];
      done();
    });
  });

  describe("getAppointmentAccordingToUser", ()=> {
    it("user with id= 6 type= 'Staff' should return result length of 2", async () => {
      const id = 6, type = "Staff";
      let getAppointmentAccordingToUserSpy = spy(appointmentQueryManager, "getAppointmentAccordingToUser");
      expect(getAppointmentAccordingToUserSpy.callCount).to.equal(0);

      const res = await getAppointmentAccordingToUserSpy(id, type);
      expect(res.length).to.equal(2);
      expect(getAppointmentAccordingToUserSpy.callCount).to.equal(1);
    });

    it("user with id= -1 type= '' should return result length of 0", async () => {
      const id = -1, type = "";
      const res = await appointmentQueryManager.getAppointmentAccordingToUser(id, type);
      expect(res.length).to.equal(0);
    });
  });
});


