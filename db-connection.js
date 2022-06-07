require('dotenv').config();
const mongoose = require("mongoose");

const URI = process.env.DB;
const db = mongoose.connect(URI, {
    useUnifiedTopology:true,
    useNewUrlParser: true
})
module.exports = db;