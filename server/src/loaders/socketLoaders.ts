import { Express } from "express";
import socketServices from "../apis/services/socket.service";
import http from "http";
import { Server } from "socket.io";
import env from "../configs/env";
const socketLoaders = (app: Express) => {
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
  io.on("connection", (socket) => {
    console.log("User connected");
    socket.on("addUser", (userId) => {
      socketServices.addNewUser(userId, socket.id);
      io.emit("getUsers", socketServices.onlineUsers);
    });

    socket.on("sendMessage", (receiverId) => {
      // console.log(users, receiverId);
      const receiver = socketServices.getUser(receiverId);
      // console.log('yoo bro you got message wake up', receiver);
      if (receiver) {
        socket.to(receiver.socketId).emit("getMessage");
      }
    });

    socket.on("typing", (receiverId) => {
      // console.log('start typing');
      const receiver = socketServices.getUser(receiverId);
      if (receiver) {
        socket.to(receiver.socketId).emit("typing");
      }
    });

    socket.on("stopTyping", (receiverId) => {
      // console.log('stop typing');
      const receiver = socketServices.getUser(receiverId);
      if (receiver) {
        socket.to(receiver.socketId).emit("stopTyping");
      }
    });
    socket.on("sendRequest", (receiverId) => {
      const receiver = socketServices.getUser(receiverId);
      if (receiver) {
        socket.to(receiver.socketId).emit("getRequest");
      }
    });
    socket.on("disconnect", () => {
      socketServices.removeUser(socket.id);
      io.emit("users", socketServices.onlineUsers);
    });
  });
  io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  server.listen(env.app.port, () => {
    console.log(`API listening on port ${env.app.port}!`);
  })
  return io;
};

export default socketLoaders;
