const express = require("express");
const { connection } = require("./config/db");
const app = express();

const Port = process.env.PORT || 5000;
const userRoutes = require("./routes/user.routes");
app.use(express.json());


// User Routes
app.use("/api/users", userRoutes);

// Server connection
app.listen(async () => {
  try {
    await connection;
    console.log("Mogno Atlas Connected");
  } catch (error) {
    console.log("Mongo connection error");
  }
  console.log(`Sever is running at ${Port}`);
});
