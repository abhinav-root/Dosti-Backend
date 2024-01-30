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

//middlewares
app.use(morgan("combined"));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(rateLimit);

//routes
app.get("/api", (_, res) => res.json({ message: "API is running!" }));
app.use("/api/auth", authController);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
