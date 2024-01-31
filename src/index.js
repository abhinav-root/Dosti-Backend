const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("./middlewares/rate-limit.middleware");
const morgan = require("morgan");
require("./config/mongo.db");
const authController = require("./auth/auth.controller");
const usersController = require("./users/users.controller");
const passport = require("passport");
const requireJwt = require("./middlewares/passport-jwt.middleware");
require("./middlewares/passport-local.middleware");
require("./middlewares/passport-jwt.middleware");
require("./middlewares/passport-jwt-refresh.middeware");

//middlewares
app.use(morgan("combined"));
app.use(express.json());
app.use(cors({ origin: process.env.REACT_APP_URL, credentials: true }));
app.use(helmet());
app.use(cookieParser());
app.use(rateLimit);
passport.initialize();

//routes
app.get("/api", (_, res) => res.json({ message: "API is running!" }));
app.use("/api/auth", authController);
app.use("/api/users", requireJwt, usersController);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
