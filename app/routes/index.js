const routes = require('express').Router();

// api/sample/*
routes.use("/sample/", require('@routes/sampleController'));
routes.use("/note/", require('@routes/noteController'));
routes.use("/authenticate/", require('@routes/authController'));

module.exports = routes;