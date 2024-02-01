const { Server } = require("socket.io");
const { createServer } = require("http");
const express = require("express");

const app = express();
const server = createServer(app);
const io = new Server(server);

module.exports = { app, io, server};
