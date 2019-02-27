const routes = require('express').Router();
const qm = require("@app/helpers/queryManager");

routes.get("/", (req, res) => {
    qm.getAllActiveUsers().then((result) => {
      res.status(200);
      res.send(result);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

routes.get("/:username", (req, res) => {
    qm.getUserWithUsernameFromTable("User", req.params.username).then((result) => {
        res.status(200);
        res.send(result);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

routes.post("/", (req, res) => {
    res.status(200);
    res.send({data: "Hello World"});
});

routes.put("/", (req, res) => {
    res.status(200);
    res.send({data: "Hello World"});
});

routes.delete("/:username", (req, res) => {
    qm.deleteUserWithUsername(req.params.username).then((result, err) => {
        res.status(200);
        res.send(result);
    }).catch((err) => {
        res.status(500).json(err);
    });
})

module.exports = routes;