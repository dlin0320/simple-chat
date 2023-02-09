import { Entity, Schema } from "redis-om";

class User extends Entity {};
export const userSchema = new Schema(
  User,
  {
    username: { type: "string" }
  },
  {
    dataStructure: "JSON"
  }
);

class Room extends Entity {};
export const roomSchema = new Schema(
  Room,
  {
    participants: { type: "string" }
  },
  {
    dataStructure: "JSON"
  }
);

class Message extends Entity {};
export const messageSchema = new Schema(
  Message,
  {
    author: { type: "string" },
    content: { type: "string" },
    room: { type: "string" },
    time: { type: "string" }
  },
  {
    dataStructure: "JSON"
  }
);