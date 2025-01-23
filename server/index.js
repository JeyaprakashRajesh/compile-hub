const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");

const databaseConnection = require("./config/database");

const AuthRouter = require("./Routes/AuthRoutes");
const UserRouter = require("./Routes/UserRoutes");

const app = express();
app.use(cors());
app.use(express.json());

databaseConnection();

app.use("/api/Auth", AuthRouter);
app.use("/api/user", UserRouter);

app.listen(PORT, () => {
  console.log("Server listening on port:", PORT);
});
