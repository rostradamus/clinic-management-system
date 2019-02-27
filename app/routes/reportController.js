const routes = require('express').Router();

routes.get("/", (req, res) => {
    res.status(200);
    res.send({data: "Hello World"});
});

routes.get("/:username", (req, res) => {
    // use req.params.username to access username.
    res.status(200);
    res.send({data: "Hello World"});
});

module.exports = routes;