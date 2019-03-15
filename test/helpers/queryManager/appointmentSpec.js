describe('appointmentQueryManager unit test', () => {
  let appointmentQueryManager;

  before(() => {
    appointmentQueryManager = require('@app/helpers/queryManager/appointment');
  });

  describe("getAppointmentAccordingToUser", ()=> {
    it("user with id= 6 type= 'Staff' should return result length of 2", async () => {
      const id = 6, type = "Staff";
      let getAppointmentAccordingToUserSpy = spy(appointmentQueryManager, "getAppointmentAccordingToUser");
      expect(getAppointmentAccordingToUserSpy.callCount).to.equal(0);

      const res = await getAppointmentAccordingToUserSpy(id, type);
      expect(res.length).to.equal(2);
      expect(getAppointmentAccordingToUserSpy.callCount).to.equal(1);

      getAppointmentAccordingToUserSpy.restore();
    });

    it("user with id= -1 type= '' should return result length of 0", async () => {
      const id = -1, type = "";
      const res = await appointmentQueryManager.getAppointmentAccordingToUser(id, type);
      expect(res.length).to.equal(0);
    });
  });
});
