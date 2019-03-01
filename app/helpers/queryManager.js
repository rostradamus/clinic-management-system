const connection = require("@config/db/connection");
const db = connection.connectDatabase();
const mysql = require('mysql');

// Public Functions

/**
 * When resolved, returns an array of JSON objects.
 *
 * @param {} table : the database table name
 * @param {Object} options : optional information for query
 *  {
 *    columns: {Array}  columns to select on query,
 *    where: {Object}  filter to apply on query
 *  }
 */
module.exports = {
  getBaseQuery: function(table, options = {}) {
    let stmt = "";
    if (options.columns && options.columns.length > 0) {
      stmt = mysql.format("SELECT ?? FROM ??", [options.columns, table]);
    } else {
      stmt = mysql.format("SELECT * FROM ??", table);
    }
    if (options.where && Object.keys(options).length > 0) {
      stmt = mysql.format(`${stmt} WHERE ?`, [options.where]);
    }
    return stmt;
  },

  getWithIdBaseQuery: function(table, id, options = {}) {
    return mysql.format(`${this.getBaseQuery(table, options)} WHERE id = ?`, id);
  },

  createBaseQuery: function(table, data) {
    const columns = Object.keys(data),
      values = Object.values(data);
    return mysql.format("INSERT INTO ??(??) VALUES ?", [table, columns, [values]]);
  },

  updateBaseQuery: function(table, id, data) {
    return mysql.format("UPDATE ?? SET ? WHERE id = ?", [table, data, id]);
  },

  softDeleteBaseQuery: function(table, id) {
    return this.updateBaseQuery(table, id, { active: false});
  },

  makeQuery: function(q) {
    return new Promise((resolve, reject) => {
      db.query(q, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  getAllEntriesFromTable: function(table, options = {}) {
    const query = this.getBaseQuery(table, options);
    return this.makeQuery(query);
  },

  getAdmissionRecordWithRecordId: function(id) {
    const query = mysql.format(`${this.getBaseQuery("Admission_record")} WHERE record_id = ?`, id);
    return this.makeQuery(query);
  },

  createThenGetEntry: async function(table, data, options = {}) {
    await db.beginTransaction();
    let result;
    try {
      const insertQuery = this.createBaseQuery(table, data);
      const insertResult = await this.makeQuery(insertQuery);
      const selectQuery = this.getWithIdBaseQuery(table, insertResult.insertId, options);
      result = await this.makeQuery(selectQuery);
      await db.commit();
    } catch(e) {
      await db.rollback();
      throw e;
    }
    return result;
  },

  updateThenGetEntry: async function(table, id, data, options = {}) {
    await db.beginTransaction();
    let result;
    try {
      const updateQuery = this.updateBaseQuery(table, id, data);
      const updateResult = await this.makeQuery(updateQuery);
      const selectQuery = this.getWithIdBaseQuery(table, id, options);
      result = await this.makeQuery(selectQuery);
      await db.commit();
    } catch(e) {
      await db.rollback();
      throw e;
    }
    return result;
  },

  softDeleteEntry: function(table, id, options = {}) {
    const query = this.softDeleteBaseQuery(table, id);
    return this.makeQuery(query);
  }
}
