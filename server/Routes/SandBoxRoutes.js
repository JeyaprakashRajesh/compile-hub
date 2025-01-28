const express = require("express");
const { Middleware } = require("../middleware/middleware");
const { handleSocketConnection } = require("../Controllers/SandBoxControllers");

const router = express.Router();

// Attach middleware to authenticate requests
router.get("/connect", Middleware, (req, res) => {
  res.status(200).json({ message: "Socket connected" });
});

module.exports = (io) => {
  // Handle all Socket.io connections
  io.on("connection", (socket) => {
    handleSocketConnection(socket);
  });

  return router;
};
