const qm = require("@app/helpers/queryManager");
const bcrypt = require("bcrypt");
const appointmentManager = require("@app/helpers/queryManager/appointment");

const BCRYPT_SALT_ROUNDS = 10;

const AUTH_ONLY_COLUMNS = ["password"];
const TABLE_NAME_INTERNAL = "User";

const VISIBILE_COLUMNS_INTERNAL = ["id", "username", "email", "phone_number",
    "first_name","last_name", "type", "permission_level"];


let getActiveUserWithId = async function(id) {
  try {
    const query = qm.getWithIdBaseQuery(TABLE_NAME_INTERNAL, id, { columns: VISIBILE_COLUMNS_INTERNAL }) + " AND ACTIVE = 1";
    const result = await qm.makeQuery(query);
    return result[0];
  } catch(err) {
    return err;
  }
}

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

  getAllActiveUsers: function(query = {}) {
    const options = {
      columns: this.VISIBILE_COLUMNS,
      where: Object.assign({...query}, { active: true })
    };
    const stmt = qm.getBaseQuery(this.TABLE_NAME, options);
    return qm.makeQuery(stmt);
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

  updateUserWithId: async function(id, data) {
    if (data.password && process.env.NODE_ENV === "production") {
      const encryptedPassword = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);
      data["password"] = encryptedPassword;
    }
    return await qm.updateThenGetEntry(this.TABLE_NAME, id, data, { columns: this.VISIBILE_COLUMNS });
  },

  softDeleteUserWithId: async function(id) {
    try {
      const user = await getActiveUserWithId(id);
      const userType = user.type;
      if (userType === "Staff" || userType === "Patient") {
        const allUpcomingAppointmentsWithUserWithId = await appointmentManager.getUpcomingAppointmentsAccordingToUser(id, userType);
        aCancelledAppointments = [];

        for (index in allUpcomingAppointmentsWithUserWithId) {
          const cancelledAppointment = await appointmentManager.softDeleteAppointmentWithId(allUpcomingAppointmentsWithUserWithId[index].id);
          const updatedAppointment = await appointmentManager.getAppointmentFromId(allUpcomingAppointmentsWithUserWithId[index].id);
          if (updatedAppointment.length === 1) {
            aCancelledAppointments.push(updatedAppointment[0]);
          }
        }

        const softDeleteEntry = await qm.softDeleteEntry(this.TABLE_NAME, id, { active: false });
        if (softDeleteEntry.affectedRows === 1) {
          return aCancelledAppointments;
        } else {
          throw new Error();
        }
      } else if (userType === "Administrator" || userType === "Admin") {
        const softDeleteEntry = await qm.softDeleteEntry(this.TABLE_NAME, id, { active: false });
        if (softDeleteEntry.affectedRows === 1) {
          return [];
        } else {
          throw new Error();
        }
      } else {
        throw new Error("user type doesn't exist");
      }
    } catch(err) {
      throw err;
    }
  }
};