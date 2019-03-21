const qm = require("@app/helpers/queryManager");
const bcrypt = require("bcrypt");

const BCRYPT_SALT_ROUNDS = 10;

const AUTH_ONLY_COLUMNS = ["password"];

module.exports = {
  TABLE_NAME: "User",

  VISIBILE_COLUMNS: ["id", "username", "email", "phone_number",
    "first_name","last_name", "type", "permission_level"],

  getUserWithUsername: function(username, isForAuth) {
    const options = {
      columns: isForAuth ? [...this.VISIBILE_COLUMNS, ...AUTH_ONLY_COLUMNS] : this.VISIBILE_COLUMNS,
      where: { username: username }
    };
    const query = qm.getBaseQuery(this.TABLE_NAME, options);
    return qm.makeQuery(query);
  },

  getUserWithId: function(id) {
    const query = qm.getWithIdBaseQuery(this.TABLE_NAME, id, { columns: this.VISIBILE_COLUMNS });
    return qm.makeQuery(query);
  },

  getAllActiveUsers: function() {
    const options = {
      columns: this.VISIBILE_COLUMNS,
      where: { active: true }
    };
    const query = qm.getBaseQuery(this.TABLE_NAME, options);
    return qm.makeQuery(query);
  },

  createUser: async function(data) {
    const initialPassword = data.phone_number.substr(-4);
    const encryptedPassword = await bcrypt.hash(initialPassword, BCRYPT_SALT_ROUNDS);
    const user = Object.assign(
      {...data},
      {
        password: process.env.NODE_ENV === "production" ? encryptedPassword : initialPassword
      }
    );
    return qm.createThenGetEntry(this.TABLE_NAME, user, { columns: this.VISIBILE_COLUMNS });
  },

  updateUserWithId: function(id, data) {
    return qm.updateThenGetEntry(this.TABLE_NAME, id, data, { columns: this.VISIBILE_COLUMNS });
  },

  softDeleteUserWithId: function(id) {
    return qm.softDeleteEntry(this.TABLE_NAME, id);
  },
}