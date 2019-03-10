const routes = require("express").Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userManager = require("@app/helpers/queryManager/user");
const bcrypt = require("bcrypt");

passport.serializeUser(({ username }, done) => done(null, username));
passport.deserializeUser((username, done) =>
  userManager.getUserWithUsername(username)
    .then(result => {
      if (result.length === 0) {
        return done(null, false, { message: "User does NOT exist. "})
      }
      return done(null, result[0]);
    })
    .catch(err => done(err, null, { message: "User does NOT exist."}))
);

passport.use(new LocalStrategy((username, password, done) => {
  userManager.getUserWithUsername(username, true)
    .then(result => {
      if (result.length === 0) {
        return done(null, false, { message: "Incorrect Username."});
      }
      bcrypt.compare(password, result[0].password)
        .then(res => {
          if (res) {
            delete result[0].password;
            return done(null, result[0]);
          } else {
            return done(null ,false, { message: "Incorrect Password."});
          }
        })
        .catch(err => { throw err; });
    })
    .catch(err => done(err));
  })
);

routes.get("/", (req, res) => {
  if (!req.user) {
    res.redirect(401,'/login');
  } else {
    res.status(200);
    res.send(req.user);
  }
});

routes.post("/", passport.authenticate("local"), (req, res) => {
  res.status(200);
  res.send(req.user);
});

routes.delete("/", (req, res) => {
  try {
    req.session = null;
    req.logout();
    res.sendStatus(204);
  } catch (e) {
    res.status(500);
    res.send(e);
  }
});

module.exports = routes;