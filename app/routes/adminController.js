const routes = require('express').Router();
const userManager = require("@app/helpers/queryManager/user");
const adminManager = require("@app/helpers/queryManager/admin");
const db = require("@config/db/connection").connectDatabase();

routes.get("/", (req, res) => {
  adminManager.getActiveAdmins(req.query)
    .then(result => {
      res.status(200);
      res.send(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

routes.get("/:admin_id", async (req, res) => {
  const { admin_id } = req.params;
  try {
    const admin = await adminManager.getAdminWithId(admin_id);
    if (admin.length !== 1) {
      if (admin.length === 0) {
        // TODO: better error message using MessageUtils
        res.status(404);
        return res.send("Admin does not exist");
      } else {
        // TODO: better message
        throw new Error("your database is messed up");
      }
    }
    res.status(200);
    return res.send(admin[0]);
  } catch(e) {
    res.status(500).json(e);
  }
});


routes.post("/", async (req, res) => {
  await db.beginTransaction();
  try {
    const userData = Object.assign({...req.body.User}, { username: req.body.User.email });
    const user = await userManager.createUser(userData);
    const adminData = Object.assign({...req.body.Admin}, { id: user[0].id });
    const admin = await adminManager.createAdmin(adminData);
    await db.commit();
    res.status(200);
    res.send({
      User: user[0],
      Admin: admin[0]
    });
  } catch(e) {
    await db.rollback();
    res.status(500).json(e);
  }
});

routes.put("/:admin_id", async (req, res) => {
  const { admin_id } = req.params;
  await db.beginTransaction();
  try {
    const userData = Object.assign({...req.body.User}, { username: req.body.User.email });
    const [user, admin] = await Promise.all([
      userManager.updateUserWithId(admin_id, userData),
      adminManager.updateAdminWithId(admin_id, req.body.Admin)
    ]);
    await db.commit();
    res.status(200);
    res.send({
      User: user[0],
      Admin: admin[0]
    });
  } catch(e) {
    await db.rollback();
    res.status(500).json(e);
  }
});

routes.delete("/:admin_id", async (req, res) => {
  const { admin_id } = req.params;
  await db.beginTransaction();
  try {
    userManager.softDeleteUserWithId(admin_id);
    await db.commit();
    res.sendStatus(204);
  } catch(e) {
    await db.rollback();
    res.status(500).json(e);
  }
});

module.exports = routes;
