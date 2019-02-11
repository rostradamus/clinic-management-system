require('dotenv').config();
require('module-alias/register');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const morgan = require('morgan');
const path = require('path');

const db = require("@config/db/connection");

const app = express();
app.use(morgan('dev'));
app.use(
  cookieSession({
    name: "session",
    maxAge: 1 * 1 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SESSION_KEY]
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(`${__dirname}/client/build`));
app.disable('etag');

// Serve API Routes
app.use("/api", require('@routes'));

// Serve public build assets
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'), err => {
    if (err) {
      res.status(500).send(err);
    }
  })
});

const server = app.listen(5000,
  () => console.log("Running server at 5000"));

process.on('SIGINT', () => {
  console.log('\nReceived kill signal, shutting down gracefully');
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
  if (db) {
    db.end();
    console.log("db connection closed");
  };

});