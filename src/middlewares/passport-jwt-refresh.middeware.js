const passport = require("passport");
const passportJwt = require("passport-jwt");
const userModel = require("../users/models/user.model");
const JwtStrategy = passportJwt.Strategy;

const extractJwtFromCookie = (req, res) => {
  const token = req.cookies?.["jwt"];
  return token;
};

passport.use(
  "jwt-refresh",
  new JwtStrategy(
    {
      passReqToCallback: true,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      jwtFromRequest: passportJwt.ExtractJwt.fromExtractors([
        extractJwtFromCookie,
      ]),
    },
    async function (req, payload, done) {
      const jwt = req.cookies["jwt"];
      const user = await userModel.findById(payload._id);
      if (user.refreshToken !== jwt) {
        return done(null, false);
      }
      return done(null, payload);
    }
  )
);
