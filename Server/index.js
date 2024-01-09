const express = require("express");
const { connection } = require("./config/db");
const app = express();
const cors = require("cors");
const { usersRouter } = require("./routes/user.routes");
const { inventoryRouter } = require("./routes/inventory.routes");
const Port = process.env.PORT || 4500;
const ip = require('ip')
const path = require("path");

app.use(express.json()); 
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
const isProduction = process.env.NODE_ENV === "production";
const viteBuildDirectory = isProduction ? "Client/build" : "public";

// Serving static files
app.use(express.static(path.join(process.cwd(), viteBuildDirectory)));

// For all other routes, serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), viteBuildDirectory, "index.html"));
});


console.log("app is running on ip " + ip.address())