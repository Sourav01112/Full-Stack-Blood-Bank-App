const express = require("express");
const { connection } = require("./config/db");
const app = express();
const cors = require("cors");
const { usersRouter } = require("./routes/user.routes");
const { inventoryRouter } = require("./routes/inventory.routes");
const Port = process.env.PORT || 4500;
const ip = require('ip')

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
  console.log(`Sever is running at ${Port}`);

  } catch (error) {
    console.log("error", error)
    console.log("Mongo connection error");
  }
});

// deployment config
const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/Client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "Client", "build", "index.html"));
  });
}


console.log("app is running on ip " + ip.address())