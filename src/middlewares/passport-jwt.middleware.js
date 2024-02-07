const passport = require("passport");
const passportJwt = require("passport-jwt");

passport.use(
  "jwt",
  new passportJwt.Strategy(
    {
      jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    },
    function (payload, cb) {
      return cb(null, payload);
    }
  )
);

const requireJwt = passport.authenticate("jwt", { session: false });
module.exports = requireJwt;
