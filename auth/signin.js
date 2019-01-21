const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const userModel = require('../models/users');

app.get('/login', (req, res, next) => {
    res.send("hello jare");
});