const express = require('express');
const app = express();
const mongoose = require('mongoose'); 

const url = app.get('env') == "development" ? "mongodb://localhost:27017/TestimonyBank" : ""/*MLab url here */;
mongoose.connect(url, { useNewUrlParser: true })
.then(success => console.log("Connection to mongoose successful"))
.catch(err => console.error("Could not connect to mongoose ", err));

module.exports = mongoose; 