const express = require("express");
const { connection } = require("./config/db");
const app = express();
const cors = require("cors");
const { usersRouter } = require("./routes/user.routes");
const { inventoryRouter } = require("./routes/inventory.routes");
const Port = process.env.PORT || 4500;
const ip = require('ip')
const path = require("path");
const dashboardRouter = require("./routes/dashboard.routes");

// Middleare
app.use(express.json()); 
app.use(cors());

// User Routes
app.use("/api/users", usersRouter);
app.use('/api/inventory', inventoryRouter)
app.use('/api/dashboard', dashboardRouter)

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
// const isProduction = process.env.NODE_ENV === "production";
// const viteBuildDirectory = isProduction ? "Client/build" : "public";

// // Serving static files
// app.use(express.static(path.join(process.cwd(), viteBuildDirectory)));

// // For all other routes, serve index.html
// app.get("*", (req, res) => {
//   res.sendFile(path.join(process.cwd(), viteBuildDirectory, "index.html"));
// });

// deployment config
// __dirname = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/Client/build")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "Client", "build", "index.html"));
//   });
// }



console.log("app is running on ip " + ip.address())
