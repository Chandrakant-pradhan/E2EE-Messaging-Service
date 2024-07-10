//first build basic express server
const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const connectDB = require("./config/connectDB")
const cors = require("cors")
const userRoute = require("./routes/userRoute")
const messageRoute = require("./routes/messageRoute")
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const {Message} = require("./models/message")

dotenv.config()
connectDB(process.env.MONGO_URL)

//building the server
const app = express()


//need some middlewares express.json and cors
app.use(express.json())
app.use(cors());

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

// --------------------------socket connection------------------------------

const io = require("socket.io")(server, {
    pingTimeout : 6000,
    cors: {
      origin: "http://localhost:5173",
    },
});

//-----------CODE FOR GEN AI-----------------------------
const genAI = new GoogleGenerativeAI(process.env.CHAT_API_KEY);

const run = async(prompt) => {
 
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const small = `ans only under 10 words only ${prompt}`
  const result = await model.generateContent(small);
  const response = result.response;
  const text = response.text();
  return text;
}

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userID) => {
      socket.join(userID);
      console.log(`socket ${socket.id} joined room ${userID}`)
      socket.emit("connected");
    });
  
    socket.on('sendMessage', async (message, callback) => {
        
      if(message.receiver.email === "chatbot@gmail.com"){
         const msg = await run(message.content);
         const AImessage = await Message.create({
          content: msg,
          sender: message.receiver._id,
          receiver: message.sender._id,
        });

        const populatedMessage = await AImessage.populate([
          { path: 'sender', select: '-password' },
          { path: 'receiver', select: '-password' }
        ]);

         socket.emit('newMessage', populatedMessage, (error) => {
              if (error) {
                return callback({ error: 'Message not sent' });
              }
          });
          callback({ success: 'Message sent' });
      }
        else{
          socket.in(message.receiver._id).emit('newMessage', message, (error) => {
              if (error) {
                return callback({ error: 'Message not sent' });
              }
            });
            callback({ success: 'Message sent' });
        }
        
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });
