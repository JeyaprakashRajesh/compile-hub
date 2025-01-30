const express = require("express");
const { registerAdmin, loginAdmin , AddUsers , AddTask} = require("../Controllers/AdminControllers");
const {Middleware} = require("../middleware/middleware")
const router = express.Router();

router.post("/signup", registerAdmin);
router.post("/login", loginAdmin);
router.post("/add-users" , Middleware , AddUsers)
router.post("/add-task" , Middleware , AddTask)

module.exports = router;
