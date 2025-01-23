const express = require("express");
const router = express.Router();

const { Middleware } = require("../middleware/middleware");
const { getUserDetails } = require("../Controllers/UserControllers");

router.get("/getUserData", Middleware, getUserDetails);

module.exports = router;
