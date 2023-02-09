import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import ContactList from "./ContactList";

function Chat({ socket, username }) {
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [contactList, setContactList] = useState([]);

  const sendMessage = async () => {
    if (message !== "") {
      const messageData = {
        author: username,
        content: message,
        room: roomId,
        time: Date.now()
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setMessage("");
    };
  };

  const selectContact = (contact) => {
    setMessageList([]);
    socket.emit("enter_room", [username, contact], (response) => {
      console.log(response.history);
      setMessageList(() => response.history);
      setRoomName(response.participants);
      setRoomId(response.roomId)
    })
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data)
      console.log(roomId)
      if (roomId === data.room) {
        setMessageList((list) => [...list, data]);
      }
    });
    socket.on("contacts", (data) => {
      setContactList(() => data);
    });
    return () => {
      socket.off("receive_message")
    }
  }, [socket, roomId]);

  return (
    <>
      <div>Welcome {username}</div>
      <h2>Contacts</h2>
      <ContactList contacts={contactList} selectContact={selectContact} />
      <div className="chat-window">
        <div className="chat-header">
          <p>{roomName}</p>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {messageList.map((message) => {
              return (
                <div
                  key={message.time}
                  className="message"
                  id={username === message.author ? "you" : "other"}
                >
                  <div>
                    <div className="message-content">
                      <p>{message.content}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{new Date(Number(message.time)).toLocaleString()}</p>
                      <p id="author">{message.author}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </ScrollToBottom>
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={message}
            placeholder="Hey..."
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            onKeyDown={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button onClick={sendMessage}>&#9658;</button>
        </div>
      </div>
    </>
  )
};

export default Chat;