import "dotenv/config"
import express, { json } from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { getUser, getContacts, loadHistory, getRoom, populate, saveMessage } from "./redis.js";
import { removeParticipants } from "./utils.js";

const app = express();
app.use(cors());
app.use(json())
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*"  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  
  socket.on("login", async (username, callback) => {
    const user = await getUser(username);
    const contacts = await getContacts(user.username)
    console.log(contacts)
    socket.emit("contacts", await getContacts(user.username));
    if (user?.rooms) {
      console.log(user.rooms)
      socket.emit("rooms", user.rooms.map(room => {
        room.participants;
      }));
    };
    callback({
      status: "ok"
    });
  });

  socket.on("enter_room", async (data, callback) => {
    const usernames = [data[0], ...data[1].split(",")];
    const room = await getRoom(usernames);
    socket.join(room.id);
    console.log(`User with ID: ${socket.id} joined room: ${room.id}`);
    const history = await loadHistory(room.id);
    callback({
      history: history,
      participants: removeParticipants(room.participants, data[0]),
      roomId: room.id
    });
  });

  socket.on("send_message", (data) => {
    saveMessage(data);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(8080, () => {
  populate();
  console.log("SERVER RUNNING");
});