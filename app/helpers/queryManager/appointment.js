const qm = require("@app/helpers/queryManager");
const mysql = require('mysql');

const TABLE_NAME = "Appointment";
const VISIBLE_COLUMNS = ["id", "patient_id", "staff_id", "record_id",
  "type_of_therapy", "start_date", "end_date", "repetition", "start_time", "end_time"];

const USER_TABLE_NAME = "User";
const USER_VISIBLE_COLUMNS = ["id", "username", "email", "phone_number",
  "first_name","last_name", "type", "permission_level"];

module.exports = {

  createAppointment: function(data) {
    return qm.createThenGetEntry(TABLE_NAME, data, { columns: VISIBLE_COLUMNS });
  },

  updateAppointmentWithId: function(id, data) {
    return qm.updateThenGetEntry(TABLE_NAME, id, data, { columns: VISIBLE_COLUMNS });
  },

  softDeleteAppointmentWithId: function(id) {
    return qm.softDeleteEntry(TABLE_NAME, id, { is_cancelled: true });
  },

  getAppointmentWithId: function(id) {
    const query = qm.getWithIdBaseQuery(TABLE_NAME, id);
    return qm.makeQuery(query);
  },

  // TODO: use AdmissionRecordManager to handle query after it has been implemented.
  getPatientAdmissionRecord: function(patient) {
    const query = mysql.format("SELECT * FROM Admission_record WHERE patient_id = ?", [patient.id]);
    return qm.makeQuery(query);
  },

  getUserWithIdFromTable: function(id) {
    const query = qm.getWithIdBaseQuery(USER_TABLE_NAME, id, { columns: USER_VISIBLE_COLUMNS });
    return qm.makeQuery(query);
  },

  getAppointmentAccordingToUser: function(id, type) {
    let queryString = "";
    if (type === "Staff") {
      queryString = "SELECT * FROM Appointment " +
        "LEFT JOIN (SELECT ?? FROM User WHERE type = 'Patient' AND active = 1) " +
        "AS Patient ON Appointment.patient_id = Patient.id " +
        "WHERE Appointment.staff_id = ? AND Appointment.is_cancelled=false";
    } else {
      queryString = "SELECT * FROM Appointment " +
        "LEFT JOIN (SELECT ?? FROM User WHERE type = 'Staff' AND active = 1) " +
        "AS Staff ON Appointment.staff_id = Staff.id " +
        "WHERE Appointment.patient_id = ? AND Appointment.is_cancelled=false";
    }
    const query = mysql.format(queryString, [USER_VISIBLE_COLUMNS, id]);
    const options = {sql: query, nestTables: true};
    return qm.getQueryWithOverlap(options);
  }
}