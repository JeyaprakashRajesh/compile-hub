const express = require("express");
const router = express.Router();

const { Middleware } = require("../middleware/middleware");
const { getUserDetails , updatePlatforms } = require("../Controllers/UserControllers");

router.get("/getUserData", Middleware, getUserDetails);

router.put("/link-platform", Middleware, updatePlatforms);

module.exports = router;
