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
  const query = getBaseQuery(table);
  return makeQuery(query);
}

function getUserWithUsernameFromTable (table, username) {
  const query = getBaseQuery(table) + ' WHERE username = "' + username + '"';
  return makeQuery(query);
}

function getAdmissionRecordWithRecordId (id) {
  const query = getBaseQuery("Admission_record") + ' WHERE record_id = "' + id + '"';
  return makeQuery(query);
}

function getAllActiveUsers () {
  const query = getBaseQuery("User") + ' WHERE active = 1'
  return makeQuery(query);
}

function deleteUserWithUsername (username) {
  const query = 'UPDATE User SET active = false WHERE username = "' + username + '"';
  return makeQuery(query);
}

module.exports = {
  getAllEntriesFromTable,
  getUserWithUsernameFromTable,
  getAdmissionRecordWithRecordId,
  getAllActiveUsers,
  deleteUserWithUsername
};
