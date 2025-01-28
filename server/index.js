const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv").config();
const databaseConnection = require("./config/database");

const app = express();
app.use(cors());
app.use(express.json());

databaseConnection();

// Main API routes
app.use("/api/Auth", require("./Routes/AuthRoutes"));
app.use("/api/user", require("./Routes/UserRoutes"));

// Set up Socket.io server
const httpServer = http.createServer(app); // Use the same `httpServer` for socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*", // This allows all origins, change as per your security needs
    methods: ["GET", "POST"],
  },
});

// Use the io instance with routes that require sockets
app.use("/api/sandbox", require("./Routes/SandBoxRoutes")(io));

// Listen on ports
app.listen(3000, () => console.log("API server running on port 3000"));
httpServer.listen(3001, () => console.log("Socket.io server running on port 3001"));
