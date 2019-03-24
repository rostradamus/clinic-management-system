const routes = require('express').Router();
const appointmentManager = require("@app/helpers/queryManager/appointment");
const admissionRecordManager = require("@app/helpers/queryManager/admissionRecord");
// TODO: Remove as moment will be added as global variable.
const moment = require('moment');
const emailManager = require("@app/helpers/emailManager");

// Helper functions
let isValidPostRequestBody = (body) => {
  const {patient, staff, start, end} = body;
  return patient && staff && start && end &&
    moment(start).isValid() && moment(end).isValid();
}

let processEmail = async (resAppointment, isNewAppointment) => {
  try {
    const [patientUser, staffUser] = await Promise.all([
      appointmentManager.getUserWithIdFromTable(resAppointment.patient_id),
      appointmentManager.getUserWithIdFromTable(resAppointment.staff_id)
    ]);

    return emailManager.sendMailForAppointment(resAppointment, patientUser[0], staffUser[0], isNewAppointment) ? true : false;
  } catch(err) {
    return false;
  }
}

let generateTimeConflictErrorMessage = (staff, patient, isStaffConflict, isPatientConflict) => {
  if (isStaffConflict && isPatientConflict) {
    return `Staff: ${staff.first_name} ${staff.last_name} and
      Patient: ${patient.first_name} ${patient.last_name} have another appointment at that time`;
  } else if (isStaffConflict) {
    return `Staff: ${staff.first_name} ${staff.last_name} has another appointment at that time`;
  } else {
    return `Patient: ${patient.first_name} ${patient.last_name} has another appointment at that time`;
  }
}

let generateDataErrorMessage = (staff, patient, type) => {
  return `We were unable to ${type} an appointment with Staff: ${staff.first_name} ${staff.last_name}
  and Patient: ${patient.first_name} ${patient.last_name}`
}

let generateAdmissionRecordErrorMessage = (patient) => {
  return `We were not able to find an Admission Record for Patient: ${patient.first_name} ${patient.last_name}`;
}

let formatAppointment = (appointment, patient, staff) => {
  appointment.start_date = moment(appointment.start_date).format("YYYY-MM-DD");
  appointment.patient = patient;
  appointment.staff = staff;
  return appointment;
}

let processCancellationEmail = async (resAppointment) => {
  try {
    const [patientUser, staffUser] = await Promise.all([
      appointmentManager.getUserWithIdFromTable(resAppointment.patient_id),
      appointmentManager.getUserWithIdFromTable(resAppointment.staff_id)
    ]);

    return emailManager.sendMailForCancellation(resAppointment, patientUser[0], staffUser[0]) ? true : false;
  } catch(err) {
    return false;
  }
}

// GET /api/appointments/users/{user_id}/
routes.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    const users = await appointmentManager.getUserWithIdFromTable(user_id);
    if (users.length === 0) {
      return res.status(400).json({
        errorMessage: {
          status: true,
          message: `User with id = ${user_id} does NOT exist`
        }
      });
    }

    const { id, type, first_name, last_name } = users[0];
    const appointments = await appointmentManager.getAppointmentAccordingToUser(id, type);
    if (appointments.length === 0) {
      return res.status(400).json({
        errorMessage: {
          status: true,
          message: `No appointments exist for ${type} named ${first_name} ${last_name}`
        }
      });
    }

    const resAppointments = appointments.map(row => type === "Patient" ?
        formatAppointment(row.Appointment, users[0], row.Staff) :
        formatAppointment(row.Appointment, row.Patient, users[0])
    );

    res.status(200);
    res.send(resAppointments);
  } catch (err) {
    res.status(500).json({
      errorMessage: {
        status: true,
        message: "Internal Server Error"
      }
    });
  }
});

// POST /api/appointments
routes.post("/", async (req, res) => {
  const {patient, staff, start, end, isCancelled} = req.body;

  try {
    const admissionRecords = await admissionRecordManager.getCurrentAdmissionRecords({patient_id : patient.id});
    if (admissionRecords.length === 0) {
      return res.status(400).json({
        errorMessage: {
          status: true,
          message: generateAdmissionRecordErrorMessage(patient)
        }
      });
    }

    const data = {
      patient_id: patient.id,
      staff_id: staff.id,
      record_id: admissionRecords[0].id,
      patient_category: admissionRecords[0].patient_category,
      type_of_therapy: "STUB",
      start_date: moment(start, "YYYY-MM-DDTHH:mm").format("YYYY-MM-DD"),
      start_time: moment(start, "YYYY-MM-DDTHH:mm").format("HH:mm:ss"),
      end_time: moment(end, "YYYY-MM-DDTHH:mm").format("HH:mm:ss"),
      // end_date: new Date(end), // This is used with repetition commented out as it is not part of MVP
      repetition: "none", // This is not part of mvp. Value is inside req.body
      is_cancelled: false
    };

    const existingStaffAppointments = await appointmentManager.getTimeConflictAppointmentCreate(staff.id, "Staff", data);
    const existingPatientAppointments = await appointmentManager.getTimeConflictAppointmentCreate(patient.id, "Patient", data);
    if (existingStaffAppointments.length !== 0 || existingPatientAppointments.length !== 0) {
      return res.status(400).json({
        errorMessage: {
          status: true,
          message: generateTimeConflictErrorMessage(
            staff, patient, existingStaffAppointments.length !== 0, existingPatientAppointments.length !== 0
          )
        }
      });
    }

    const appointments = await appointmentManager.createAppointment(data);
    if (appointments.length === 0) {
      return res.status(404).json({
        errorMessage: {
          status: true,
          message: generateDataErrorMessage(staff, patient, "create")
        }
      });
    }
    const { patient_id, staff_id} = appointments[0];
    const resAppointment = formatAppointment(appointments[0], patient, staff);

    if (processEmail(resAppointment, true)) {
      res.status(200);
      res.send(resAppointment);
    } else {
      // rollback database, hard delete the added appointment.
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      errorMessage: {
        status: true,
        message: "Internal Server Error"
      }
    });
  }
});

// PUT /api/appointments/:appointment_id
routes.put("/:appointment_id", async (req, res) => {
  const {patient, staff, start, end, isCancelled} = req.body;
  const { appointment_id } = req.params;

  try {
    const admissionRecords = await admissionRecordManager.getCurrentAdmissionRecords({patient_id : patient.id});
    if (admissionRecords.length === 0) {
      return res.status(400).json({
        errorMessage: {
          status: true,
          message: generateAdmissionRecordErrorMessage(patient)
        }
      });
    }

    const data = {
      patient_id: patient.id,
      staff_id: staff.id,
      record_id: admissionRecords[0].id,
      patient_category: admissionRecords[0].patient_category,
      type_of_therapy: "STUB", // TODO: this may also be updated depending on the change of user
      start_date: moment(start, "YYYY-MM-DDTHH:mm").format("YYYY-MM-DD"),
      start_time: moment(start, "YYYY-MM-DDTHH:mm").format("HH:mm:ss"),
      end_time: moment(end, "YYYY-MM-DDTHH:mm").format("HH:mm:ss"),
      is_cancelled: false
    };

    const existingStaffAppointments = await appointmentManager.getTimeConflictAppointmentUpdate(staff.id, "Staff", data, appointment_id);
    const existingPatientAppointments = await appointmentManager.getTimeConflictAppointmentUpdate(patient.id, "Patient", data, appointment_id);

    if (existingStaffAppointments.length !== 0 || existingPatientAppointments.length !== 0) {
      return res.status(400).json({
        errorMessage: {
          status: true,
          message: generateTimeConflictErrorMessage(
            staff, patient, existingStaffAppointments.length !== 0, existingPatientAppointments.length !== 0
          )
        }
      });
    }

    const updatedAppointment = await appointmentManager.updateAppointmentWithId(appointment_id, data);
    if (updatedAppointment.length === 0) {
      return res.status(404).json({
        errorMessage: {
          status: true,
          message: generateDataErrorMessage(staff, patient, "update")
        }
      });
    }
    const resAppointment = formatAppointment(updatedAppointment[0], patient, staff);

    if (processEmail(resAppointment, false)) {
      res.status(200);
      res.send(resAppointment);
    } else {
      // rollback database, hard delete the added appointment.
    }
  } catch (err) {
    res.status(500).json({
      errorMessage: {
        status: true,
        message: "Internal Server Error"
      }
    });
  }
});

// DELETE /api/appointments/:appointment_id
routes.delete("/:appointment_id", async (req, res) => {
  const { appointment_id } = req.params;
  try {
    const cancelledAppointment = await appointmentManager.softDeleteAppointmentWithId(appointment_id);
    const cancelledAppointmentDetails = await appointmentManager.getAppointmentWithId(appointment_id);
    if (cancelledAppointment.affectedRows !== 1) {
      return res.status(404).json({
        errorMessage: {
          status: true,
          message: generateDataErrorMessage(staff, patient, "delete")
        }
      });
    }

    if (processCancellationEmail(cancelledAppointmentDetails[0])) {
      res.sendStatus(204);
    } else {
      // rollback cancellation
    }
  } catch (err) {
    res.status(500).json({
      errorMessage: {
        status: true,
        message: "Internal Server Error"
      }
    });
  }
});

module.exports = routes;