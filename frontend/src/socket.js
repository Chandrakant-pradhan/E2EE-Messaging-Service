import { io } from "socket.io-client";

const URL = "https://e2ee-messaging-service.onrender.com";
const socket = io(URL, { autoConnect: false });



socket.onAny((event, ...args) => {
  console.log(event, args);
});

export const onRefresh = () => {
   socket.connect();
   const user = JSON.parse(sessionStorage.getItem("userInfo"));
    if (user) {
      socket.emit("setup", user._id);
  }
}

export const setupUser = (user) => {
  socket.connect();
  socket.emit("setup", user._id);
};

export const sendingMessageToOther = (message) => {
  socket.emit('sendMessage', message, (response) => {
    if (response.error) {
      console.error('Error sending message:', response.error);
    } else {
      console.log('Message sent successfully:', response.success);
    }
  });
};

export const newMessageArrived = (callback) => {
  socket.on("newMessage", callback);
};


export default socket;
