const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const port = 3000;

const app = express();
const server = createServer(app);

// Apply CORS middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
}));

// Create Socket.IO server instance with CORS options
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Socket.IO event handlers
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("message", ({room,message}) => {
    console.log(room,message);
    // socket.broadcast.emit("receive-message",data)
    io.to(room).emit("receive-message",message)
  });

  

  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
  });
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
