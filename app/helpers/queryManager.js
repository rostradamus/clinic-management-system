const connection = require("@config/db/connection");
const db = connection.connectDatabase();

// Private Functions

function getBaseQuery (table) {
  return "SELECT * FROM " + table;
}

function makeQuery (q) {
  return new Promise((resolve, reject) => {
    db.query(q, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

// Public Functions

/**
 * When resolved, returns an array of JSON objects.
 * 
 * @param {} table : the database table name
 */
function getAllEntriesFromTable (table) {
  let query = getBaseQuery(table);
  return makeQuery(query);
}

function getUserWithUsernameFromTable (table, username) {
  let query = getBaseQuery(table) + ' WHERE username = "' + username + '"';
  return makeQuery(query);
}

function getAdmissionRecordWithRecordId (id) {
  let query = getBaseQuery("Admission_record") + ' WHERE record_id = "' + id + '"';
  return makeQuery(query);
}

module.exports = {
  getAllEntriesFromTable,
  getUserWithUsernameFromTable,
  getAdmissionRecordWithRecordId
};
