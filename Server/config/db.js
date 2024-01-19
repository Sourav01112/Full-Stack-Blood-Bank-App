const mongoose = require("mongoose");
require("dotenv").config();


const uri = process.env.mongoURL;


// mongoose.set("debug", (collectionName, method, query, doc) => {
//     console.log(`"---------",${collectionName}.${method}`, JSON.stringify(query), doc);
//   });

var connection = mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = { connection };