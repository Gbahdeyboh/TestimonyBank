const express = require('express');
const app = express();
const mongoose = require('mongoose');

const url = app.get('env') == "production" ? "mongodb://testimony_bank:Testimony4real@ds141209.mlab.com:41209/testimony_bank" : "mongodb://localhost:27017/TestimonyBank" /*MLab url here */ ;

// const url = "mongodb://testimony_bank:Testimony4real@ds141209.mlab.com:41209/testimony_bank";

console.log("Environment is ", app.get('env'));

mongoose.connect(url, {
        useNewUrlParser: true
    })
    .then(success => console.log("Connection to mongoose successful"))
    .catch(err => console.error("Could not connect to mongoose ", err));

module.exports = mongoose;