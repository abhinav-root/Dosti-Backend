const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
require("./config/mongo.db");

//middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());

//routes
app.get("/api", (req, res) => res.json({ message: "API is running!" }));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
