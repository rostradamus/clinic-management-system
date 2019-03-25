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
        return done(null, false, { field: "username", message: "The username you’ve entered doesn’t match any account."});
      }
      if (process.env.NODE_ENV === "production") {
        bcrypt.compare(password, result[0].password)
          .then(res => {
            if (res) {
              delete result[0].password;
              return done(null, result[0]);
            } else {
              return done(null, false, { field: "password", message: "The password you’ve entered is incorrect."});
            }
          })
          .catch(err => { throw err; });
      } else {
        if (password === result[0].password) {
          return done(null, result[0]);
        } else {
          return done(null, false, { field: "password", message: "The password you’ve entered is incorrect."});
        }
      }
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

routes.post("/", (req, res, next) => {
  passport.authenticate('local', { session: true } , (err, user, info) => {
    if (err) { return res.status(500).json(err) }
    if (!user) { return res.status(401).json( { field: info.field, message: info.message }) }
    req.login(user, err => {
      if (err) return res.status(500).json(err);
      res.send(user);
    });
  })(req, res, next);
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