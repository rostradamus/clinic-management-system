const routes = require('express').Router();

routes.get("/", (req, res) => {
  res.status(200);
  res.send({data: "Hello World"});
});

routes.get("/:id", (req, res) => {
  res.status(200);
  res.send({data: `Hello, ${req.params.id}`});
});

module.exports = routes;