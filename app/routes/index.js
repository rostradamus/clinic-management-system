const routes = require('express').Router();

// api/sample/*
routes.use("/sample/", require('@routes/sampleController'));
routes.use("/note/", require('@routes/noteController'));
routes.use("/authenticate/", require('@routes/authController'));
routes.use("/users/", require("@routes/userController"));
routes.use("/reports/", require("@routes/reportController"));
routes.use("/appointments/", require("@routes/appointmentController"));

module.exports = routes;