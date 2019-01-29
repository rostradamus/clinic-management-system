const mysql = require('mysql');
let db;

const connectDatabase = () => {
    if (!db) {
        db = mysql.createConnection({
          host     : process.env.DB_HOST,
          user     : process.env.DB_USERNAME,
          password : process.env.DB_PASSWORD,
          database : process.env.DB_NAME
        });

        db.connect(err => {
            if(!err) {
                console.log('Database is connected!');
            } else {
                console.log('Error connecting database!');
            }
        });
    }
    return db;
}

module.exports = connectDatabase();