const routes = require('express').Router();
const userManager = require("@app/helpers/queryManager/user");
const bcrypt = require("bcrypt");

const BCRYPT_SALT_ROUNDS = 10;

routes.get("/", (req, res) => {
  userManager.getAllActiveUsers()
    .then(result => {
      res.status(200);
      res.send(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

routes.get("/:user_id", (req, res) => {
  userManager.getUserWithId(req.params.user_id)
    .then(result => {
      if (result.length === 0) {
        res.status(404)
          .json({ message: `User with id = ${req.params.user_id} does NOT exit`});
      }
      res.status(200);
      res.send(result[0]);
    }).catch(err => {
      res.status(500).json(err);
    });
});

routes.post("/", async (req, res) => {
  try {
    // TODO: TEMPORARY SOLUTION TO USER REGISTRATION
    const initialPassword = req.body.phone_number.substr(-4);
    const encryptedPassword = await bcrypt.hash(initialPassword, BCRYPT_SALT_ROUNDS);
    const user = Object.assign({...req.body}, { password: encryptedPassword });

    const result = await userManager.createUser(user);
    if (result.length === 0)
      throw new Error();
    res.status(200);
    res.send(result[0]);
  } catch (e) {
    res.status(500).json(e);
  }
});

routes.put("/:user_id", (req, res) => {
  userManager.updateUserWithId(req.params.user_id, req.body)
    .then(result => {
      if (result.length === 0)
        res.sendStatus(404);
      res.status(200);
      res.send(result[0]);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

routes.delete("/:user_id", (req, res) => {
  userManager.deleteUserWithId(req.params.user_id)
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
