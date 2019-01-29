const routes = require('express').Router();


routes.get("/", (req, res) => {
  const db = require("@config/db/connection");
  db.query("SELECT * FROM notes", (err, result, fields) => {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }
    res.status(200);
    res.send(JSON.parse(JSON.stringify(result)));
  });
});

routes.get("/:note_id", (req, res) => {
  const db = require("@config/db/connection");
  db.query("SELECT * FROM notes WHERE note_id = ?", [req.params.note_id], (err, result, fields) => {
    if (err) {
      res.status(500);
      return res.send(err);
    }
    if (result.length == 0) {
      return res.sendStatus(404);
    }
    res.status(200);
    res.send(JSON.parse(JSON.stringify(result[0])));
  });
});

module.exports = routes;