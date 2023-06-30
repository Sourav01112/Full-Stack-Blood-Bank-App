const express = require("express");

const app = express();

const Port = process.env.PORT || 5000;

app.listen(() => {
  console.log(`Sever is running at ${Port}`);
});
