const qm = require("@app/helpers/queryManager");
const mysql = require('mysql');

const TABLE_NAME = "Appointment";
const VISIBLE_COLUMNS = ["id", "patient_id", "staff_id", "record_id",
  "type_of_therapy", "start_date", "end_date", "repetition", "start_time", "end_time"];

const USER_TABLE_NAME = "User";
const USER_VISIBLE_COLUMNS = ["id", "username", "email", "phone_number",
  "first_name","last_name", "type", "permission_level"];

module.exports = {
  getAppointmentWithIdWithStaffAndPatient: function(id) {
    const queryString = "SELECT * FROM appointment " +
      "LEFT JOIN (SELECT ?? FROM user WHERE type = 'Patient' AND active = 1) " +
      "AS patient ON appointment.patient_id = patient.username " +
      "LEFT JOIN (SELECT ?? FROM user WHERE type = 'Staff' AND active = 1) " +
      "AS staff ON appointment.staff_id = staff.username " +
      "WHERE appointment.id = " + id;

    const query = mysql.format(queryString, [USER_VISIBLE_COLUMNS, USER_VISIBLE_COLUMNS]);
    const options = {sql: query, nestTables: true}
    return qm.getQueryWithOverlap(options);
  },

  createAppointment: function(data) {
    return qm.createThenGetEntry(TABLE_NAME, data, { columns: VISIBLE_COLUMNS });
  },

  updateAppointmentWithId: function(id, data) {
    return qm.updateThenGetEntry(TABLE_NAME, id, data, { columns: VISIBLE_COLUMNS });
  },

  deleteAppointmentWithId: function(id) {
    return qm.hardDeleteEntry(TABLE_NAME, id);
  },

  getAllAppointmentsWithStaffAndPatient: function() {
    const queryString = "SELECT * FROM appointment " +
      "LEFT JOIN (SELECT ?? FROM user WHERE type = 'Patient' AND active = 1) " +
      "AS patient ON appointment.patient_id = patient.username " +
      "LEFT JOIN (SELECT ?? FROM user WHERE type = 'Staff' AND active = 1) " +
      "AS staff ON appointment.staff_id = staff.username";

    const query = mysql.format(queryString, [USER_VISIBLE_COLUMNS, USER_VISIBLE_COLUMNS]);
    const options = {sql: query, nestTables: true}
    return qm.getQueryWithOverlap(options);
  },

  getStaffAndPatientInfoForAllAppointments: function() {
    const query = mysql.format("SELECT ? FROM User AS u RIGHT OUTER JOIN appointment AS a ON a.patient_id = u.username OR a.staff_id = u.username ORDER BY a.id, type", [USER_VISIBLE_COLUMNS]);
    return qm.makeQuery(query);
  },

  getStaffAndPatientInfoWithAppointmentId: function(id) {
    const query = mysql.format("SELECT ?? FROM User AS u LEFT OUTER JOIN appointment as a on a.patient_id = u.username OR a.staff_id = u.username WHERE a.id = " + id + " ORDER BY type", [USER_VISIBLE_COLUMNS]);
    return qm.makeQuery(query);
  },

  getUserWithIdFromTable: function(id) {
    const query = qm.getWithIdBaseQuery(USER_TABLE_NAME, id, { columns: USER_VISIBLE_COLUMNS });
    return qm.makeQuery(query);
  },

  getAppointmentAccordingToUser: function(id, type) {
    let queryString = "";
    if (type === "Staff") {
      queryString = "SELECT * FROM appointment " +
        "LEFT JOIN (SELECT ?? FROM user WHERE type = 'Patient' AND active = 1) " +
        "AS patient ON appointment.patient_id = patient.id " +
        "WHERE appointment.staff_id = ?";
    } else {
      queryString = "SELECT * FROM appointment " +
        "LEFT JOIN (SELECT ?? FROM user WHERE type = 'Staff' AND active = 1) " +
        "AS staff ON appointment.staff_id = staff.id " +
        "WHERE appointment.patient_id = ?";
    }
    const query = mysql.format(queryString, [USER_VISIBLE_COLUMNS, id]);
    const options = {sql: query, nestTables: true};
    return qm.getQueryWithOverlap(options);
  }
}



















