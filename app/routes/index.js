const routes = require('express').Router();

// api/sample/*
routes.use("/sample/", require('@routes/sampleController'));
routes.use("/note/", require('@routes/noteController'));

module.exports = routes;