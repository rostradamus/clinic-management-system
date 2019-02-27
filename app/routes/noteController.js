const routes = require('express').Router();
const qm = require("@app/helpers/queryManager");

routes.get("/notes", (req, res) => {
    qm.getUserWithUsernameFromTable("User", "mikeyoon").then((result, err) => {
      if (err) {
        throw err;
      }
      res.status(200);
      res.send(result);
    })
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