const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./db/db");
const userRouter = require("./routes/user_route");
const adminRouter = require("./routes/admin_route");
dotenv.config({
  path: ".env",
});

//setting up express
const app = express();
app.use(express.json());

app.use("/admin", adminRouter);
app.use("/user", userRouter);

async function startServer() {
  try {
    await connectDB();
    app.listen(3000, () => {
      console.log("server started with database");
    });
  } catch (error) {
    console.log("something went wrong while starting server", error.message);
  }
}
startServer();
