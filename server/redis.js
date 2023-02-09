import { Client } from "redis-om";
import { Redis } from "ioredis";
import { userSchema, roomSchema, messageSchema } from "./entities.js"
import { addParticipants, createParticipants, listRemove } from "./utils.js";

const client = await new Client().open(process.env.REDIS_URL);
export const redis = new Redis(process.env.REDIS_URL);
const userRepo = client.fetchRepository(userSchema);
await userRepo.createIndex();
const roomRepo = client.fetchRepository(roomSchema);
await roomRepo.createIndex();
const messageRepo = client.fetchRepository(messageSchema);
await messageRepo.createIndex();

export const populate = () => {
  getUser("user1")
  getUser("user2")
  getUser("user3")
  getUser("user4")
}

export const getUser = async (username) => {
  let user = await userRepo.search()
    .where("username").eq(username)
    .return.first();
  if (!user) {
    user = userRepo.createAndSave({ username: username, rooms: [] });
  };
  return user;
};

export const getContacts = async (username) => {
  console.log(await userRepo.search().returnAll())
  const usernames = (await userRepo.search()
    .returnAll()).map(user => user.username);
  listRemove(usernames, username)
  return usernames;
};

export const getRoom = async (usernames) => {
  const participants = createParticipants(usernames);
  let room = await roomRepo.search()
    .where("participants").eq(participants).return.first();
  if (!room) {
    room = await roomRepo.createAndSave({ 
      participants: participants
    });
    for (const username of usernames) {
      joinRoom(username, room.entityId);
    };
  }
  const id = room.entityId
  return { id, participants };
};

export const joinRoom = (username, roomId) => {
  userRepo.search().where("username").eq(username)
    .return.first().then((user) => {
      userRepo.save(user);
    });
  roomRepo.fetch(roomId).then((room) => {
    addParticipants(room.participants, username);
  });
};

export const saveMessage = (message) => {
  messageRepo.createAndSave(message);
}

export const loadHistory = async (roomId) => {
  return await messageRepo.search()
    .where("room").eq(roomId).return.all();
};