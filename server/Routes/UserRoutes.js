const express = require("express");
const router = express.Router();
  
const { Middleware } = require("../middleware/middleware");
const { getUserDetails , updatePlatforms , createSandbox , getSandbox } = require("../Controllers/UserControllers");
 
router.get("/getUserData", Middleware, getUserDetails);

router.put("/link-platform", Middleware, updatePlatforms);   

router.post("/create-sandbox", Middleware, createSandbox);

router.get("/getsandbox", Middleware , getSandbox);

module.exports = router;
