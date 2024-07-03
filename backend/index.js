//first build basic express server
const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const connectDB = require("./config/connectDB")
const cors = require("cors")
const userRoute = require("./routes/userRoute")
const messageRoute = require("./routes/messageRoute")
const path = require("path");


//then connect with a mongodb and also setup the env variables
//configure dotenv
dotenv.config()
connectDB(process.env.MONGO_URL)

//building the server
const app = express()

//need some middlewares express.json and cors
app.use(express.json())

const corsOptions ={
    origin:'https://e2ee-messaging-service.onrender.com/', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

//prepare the routes
app.use("/api/user" , userRoute);
app.use("/api/message" , messageRoute);

//port
const portNo = process.env.PORT || 10000;
//start the server
const server = app.listen( portNo , () => {console.log(`Server started at ${portNo}`)})

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

const io = require("socket.io")(server, {
    pingTimeout : 6000,
    cors: {
      origin: "http://localhost:5173",
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userID) => {
      socket.join(userID);
      console.log(`socket ${socket.id} joined room ${userID}`)
      socket.emit("connected");
    });
  
    socket.on('sendMessage', (message, callback) => {

        const room = io.sockets.adapter.rooms.get(message.receiver._id);
    
        if (!room) {
          return callback({ error: 'Room does not exist' });
        }
    
        socket.in(message.receiver._id).emit('newMessage', message, (error) => {
          if (error) {
            return callback({ error: 'Message not sent' });
          }
        });
    
        callback({ success: 'Message sent' });
      });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });

