const { Server } = require("socket.io");
const { createServer } = require("http");
const express = require("express");
const chatModel = require("../chats/models/chat.model");

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: process.env.REACT_APP_URL } });

const socketMap = {};

io.on("connection", (socket) => {
  socket.on("online", async (userId) => {
    console.log("A user is online", socket.id, userId);
    socketMap[userId] = socket.id;
    console.log("On connect map state", socketMap);
    io.emit("online-users", socketMap);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    for (const userId in socketMap) {
      if (socketMap[userId] === socket.id) {
        delete socketMap[userId];
        console.log("Removing from map", userId);
        console.log("On disconnect map state", socketMap);
      }
    }
    io.emit("online-users", socketMap);
  });

  socket.on("mark-chats-delivered", async (userId) => {
    await chatModel.updateMany(
      { users: userId },
      { messageStatus: "DELIVERED" }
    );
    socket.broadcast.emit("mark-chats-delivered", userId);
  });

  socket.on("delete-chat", (chatId) => {
    socket.broadcast.emit("delete-chat", chatId)
  })
});

app.set("socketio", io); //here you export my socket.io to a global
app.set("socketMap", socketMap);

module.exports = { app, server, io, socketMap };
