const express = require("express");
const router = express.Router();
const { CompileCode } = require("../Controllers/CompileController")

router.post("/execute", CompileCode);

module.exports = router;
