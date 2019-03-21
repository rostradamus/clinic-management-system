const routes = require('express').Router();
const appointmentManager = require("@app/helpers/queryManager/appointment");
// TODO: Remove as moment will be added as global variable.
const moment = require('moment');

// Helper functions
let isValidPostRequestBody = (body) => {
  const {patient, staff, start, end} = body;
  return patient && staff && start && end &&
    moment(start).isValid() && moment(end).isValid();
}

// GET /api/appointments/users/{user_id}/
// TODO: instead of front end creating title, start, end field backend will do it to reduce number of
// iterations done on list of appointments
routes.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    const users = await appointmentManager.getUserWithIdFromTable(user_id);
    if (users.length === 0)
      res.status(404).json({ message: `User with id = ${user_id} does NOT exist`});

    const { id, type } = users[0];
    const appointments = await appointmentManager.getAppointmentAccordingToUser(id, type);
    if (appointments.length === 0)
      res.status(404).json({ message: `No appointment exist for user with id = ${user_id}`});

    const resAppointments = appointments.map(row => {
      let appointment = row.Appointment;
      appointment.start_date = moment(appointment.start_date).format("YYYY-MM-DD");

      if (type === "Patient") {
        // means row contains Staff
        const staff = row.Staff;
        appointment.patient = users[0];
        appointment.staff = staff;
      } else {
        // means row contains Patient
        const patient = row.Patient;
        appointment.staff = users[0];
        appointment.patient = patient;
      }
      return appointment;
    });

    res.status(200);
    res.send(resAppointments);
  } catch (err) {
    res.status(500).json(err)
  }
});

// POST /api/appointments
routes.post("/", async (req, res) => {
  if (!isValidPostRequestBody(req.body)) throw new Error();
  const {patient, staff, start, end} = req.body; //

  // Need to go through all admissionRecord to find one active admission record
  const admissionRecords = await appointmentManager.getPatientAdmissionRecord(patient);
  if (admissionRecords.length === 0) throw new Error();

  try {
    const data = {
      patient_id: patient.id,
      staff_id: staff.id,
      record_id: admissionRecords[0].id,
      patient_category: admissionRecords[0].patient_category,
      type_of_therapy: "STUB",
      start_date: moment(start).format("YYYY-MM-DD"),
      // end_date: new Date(end), // This is used with repetition commented out as it is not part of MVP
      repetition: "none", // This is not part of mvp. Value is inside req.body
      start_time: moment(start).format("HH:mm:ss"),
      end_time: moment(end).format("HH:mm:ss"),
      is_cancelled: false
    };

    const appointments = await appointmentManager.createAppointment(data);
    if (appointments.length === 0) {
      throw new Error();
    }
    const { patient_id, staff_id} = appointments[0];

    let resAppointment = appointments[0];
    resAppointment.start_date = moment(resAppointment.start_date).format("YYYY-MM-DD");

    resAppointment.patient = patient;
    resAppointment.staff = staff;

    res.status(200);
    res.send(resAppointment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// TODO: PUT /api/appointments/{id}
routes.put("/:appointment_id", (req, res) => {
  res.status(200);
  res.send({ msg: "STUB" });
});

// TODO: DELETE /api/appointments/{id}
routes.delete("/:appointment_id", (req, res) => {
  res.status(200);
  res.send({ msg: "STUB" });
});

module.exports = routes;