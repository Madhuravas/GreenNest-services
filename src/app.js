const express = require("express");
const app = express();
const { connectDB } = require("./config/Database");

const authRouter = require("./Routers/auth");
const userRouter = require("./Routers/user");

app.use(express.json());

app.use("/", authRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
