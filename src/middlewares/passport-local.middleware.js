const passport = require("passport");
const userModel = require("../users/models/user.model");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    username,
    password,
    done
  ) {
    const user = await userModel.findByEmail(username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: "Invalid email or password" });
    }
    return done(null, user);
  })
);
