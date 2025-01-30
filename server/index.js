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

app.use("/api/Auth", require("./Routes/AuthRoutes"));
app.use("/api/user", require("./Routes/UserRoutes"));
app.use("/api/compile" , require("./Routes/CompileRoutes"))
app.use("/api/admin" , require("./Routes/AdminRoutes"))
  
const httpServer = http.createServer(app); 
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use("/api/sandbox", require("./Routes/SandBoxRoutes")(io));

app.listen(3000, () => console.log("API server running on port 3000"));
httpServer.listen(3001, () => console.log("Socket.io server running on port 3001"));
