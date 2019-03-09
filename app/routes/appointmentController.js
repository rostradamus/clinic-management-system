const routes = require('express').Router();
const appointmentManager = require("@app/helpers/queryManager/appointment");


// GET /api/appointments
// NOT USED BUT SAVED FOR FUTURE USE
routes.get("/", (req, res) => {
  // TODO: Add query parameter handling
  appointmentManager.getAllAppointmentsWithStaffAndPatient()
    .then(result1 => {
      res.status(200);
      res.send(result1);
    })
    .catch(err1 => {
      res.status(500).json(err1);
    });
});

// GET /api/appointments/{id}
routes.get("/:user_id", (req, res) => {
  appointmentManager.getUserWithIdFromTable(req.params.user_id).then(users => {
    if (users.length === 0) {
      res.status(404).json(
        { message: `User with id = ${req.params.user_id} does NOT exit`}
      );
    }

    const { username, type } = users[0];
    appointmentManager.getAppointmentAccordingToUser(username, type).then(appointments => {
      if (appointments.length === 0) {
        res.status(404).json(
          { message: `No appointment exist for user with id = ${req.params.user_id}`}
        );
      }
      const resAppointments = appointments.map(row => {
        let { appointment } = row;
        if (type === "Patient") {
          // means row contains Staff
          const { staff } = row;
          appointment.patient = users[0];
          appointment.staff = staff;
        } else {
          // means row contains Patient
          const { patient } = row;
          appointment.staff = users[0];
          appointment.patient = patient;
        }
        return appointment;
      });

      res.status(200);
      res.send(resAppointments);

    }).catch(err => {
      res.status(500).json(err);
    });
  }).catch(err => {
    res.status(500).json(err);
  });
});

// POST /api/appointments
routes.post("/", (req, res) => {
  appointmentManager.createAppointment(req.body)
    .then(result1 => {
      if (result1.length === 0) {
        throw new Error();
      }
      // appointmentManager.getStaffAndPatientInfoWithAppointmentId(result1[0].id)
      //   .then(result2 => {
      //     result1[0].patient = result2[1];
      //     result1[0].staff = result2[0];
      //     delete result1[0].patient_id;
      //     delete result1[0].staff_id;
      //     res.status(200);
      //     res.send(result1[0]);
      //   }).catch(err2 => {
      //     res.status(500).json(err2);
      //   });
      appointmentManager.getAppointmentWithIdWithStaffAndPatient(result1[0].id)
        .then(result2 => {
          res.status(201);
          res.send(result2);
        })
        .catch(err2 => {
          res.status(500).json(err2);
        });
    })
    .catch(err1 => {
      res.status(500).json(err1);
    });
});

// PUT /api/appointments/{id}
routes.put("/:appointment_id", (req, res) => {
  appointmentManager.updateAppointmentWithId(req.params.appointment_id, req.body)
    .then(result1 => {
      if (result1.length === 0) {
        res.sendStatus(404);
      }
      // appointmentManager.getStaffAndPatientInfoWithAppointmentId(req.params.appointment_id)
      //   .then(result2 => {
      //     result1[0].patient = result2[1];
      //     result1[0].staff = result2[0];
      //     delete result1[0].patient_id;
      //     delete result1[0].staff_id;
      //     res.status(200);
      //     res.send(result1[0]);
      //   }).catch(err2 => {
      //     res.status(500).json(err2);
      //   });
      appointmentManager.getAppointmentWithIdWithStaffAndPatient(req.params.appointment_id)
        .then(result2 => {
          res.status(200);
          res.send(result2);
        })
        .catch(err2 => {
          res.status(500).json(err2);
        });
    })
    .catch(err1 => {
      res.status(500).json(err1);
    });
});

// DELETE /api/appointments/{id}
routes.delete("/:appointment_id", (req, res) => {
  appointmentManager.deleteAppointmentWithId(req.params.appointment_id)
    .then(result => {
      if (result.affectedRows === 0)
        res.sendStatus(404);
      res.sendStatus(204);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = routes;