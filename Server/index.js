const express = require("express");
const { connection } = require("./config/db");
const app = express();
const cors = require("cors");
const { usersRouter } = require("./routes/user.routes");
const { inventoryRouter } = require("./routes/inventory.routes");
const Port = process.env.PORT || 4500;

app.use(express.json()); //to access request.body variables
app.use(cors());

// User Routes
app.use("/users", usersRouter);
app.use('/inventory', inventoryRouter)

// Server connection
app.listen(Port, async () => {
  try {
    await connection;
    console.log("Mogno Atlas Connected");
  } catch (error) {
    console.log("Mongo connection error");
  }
  console.log(`Sever is running at ${Port}`);
});
