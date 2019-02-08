const routes = require('express').Router();


routes.post("/", (req, res) => {
  const params = req.body && req.body.params;
  // const db = require("@config/db/connection");
  res.status(200);
  res.send({
    email: params.email,
    age: 123123
  });
});

module.exports = routes;