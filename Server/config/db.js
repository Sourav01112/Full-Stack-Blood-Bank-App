const mongoose = require("mongoose");
require("dotenv").config();




const uri = process.env.mongoURL;

var connection = mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = { connection };