const qm = require("@app/helpers/queryManager");

const TABLE_NAME = "User";
const VISIBILE_COLUMNS = ["id", "username", "email", "phone_number",
  "first_name","last_name", "type", "permission_level"];
const AUTH_ONLY_COLUMNS = ["password"];

module.exports = {
  getUserWithUsername: function(username, isForAuth) {
    const options = {
      columns: isForAuth ? [...VISIBILE_COLUMNS, ...AUTH_ONLY_COLUMNS] : VISIBILE_COLUMNS,
      where: { username: username }
    };
    const query = qm.getBaseQuery(TABLE_NAME, options);
    return qm.makeQuery(query);
  },

  getUserWithId: function(id) {
    const query = qm.getWithIdBaseQuery(TABLE_NAME, id, { columns: VISIBILE_COLUMNS });
    return qm.makeQuery(query);
  },

  getAllActiveUsers: function() {
    const options = {
      columns: VISIBILE_COLUMNS,
      where: { active: true }
    };
    const query = qm.getBaseQuery(TABLE_NAME, options);
    return qm.makeQuery(query);
  },

  createUser: function(data) {
    return qm.createThenGetEntry(TABLE_NAME, data, { columns: VISIBILE_COLUMNS });
  },

  updateUserWithId: function(id, data) {
    return qm.updateThenGetEntry(TABLE_NAME, id, data, { columns: VISIBILE_COLUMNS });
  },

  deleteUserWithId: function(id) {
    return qm.softDeleteEntry(TABLE_NAME, id);
  },
}