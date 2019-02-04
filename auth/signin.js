const express = require('express');
const app = express();

const hash = require('./hash'); //pasword hashing module

const jwt = require('jsonwebtoken');
const usersModel = require('../models/users');

app.post('/login', verifyEmail, verifyPassword, (req, res, next) => {
    //Remove the password details from the object before sending to client
    delete req.user.password.salt; 
    delete req.user.password.password;
    delete req.user.password;
    res.status(200).json({
        success: true,
        payload: {
            message: "User successfully logged in",
            data: req.user,
            token: req.token
        }
    })
});


function verifyEmail(req, res, next){
    usersModel.find({email: req.body.email})
    .then(user => {
        if(user.length >= 0 && user[0] !== undefined){
            req.salt = user[0].password.salt; //Append the salt of the user to the request object
            req.user = user[0]; //Append user details to request object
            next(); //call next  middleware
        }
        else{
            res.status(404).json({
                success: false,
                payload: null,
                error: {
                    code: 404,
                    message: "Wrong email or password provided"
                }
            })
        }
    })
    .catch(err => {
        res.send(`Could not find user ${err}`);
    })
}

function verifyPassword(req, res, next){
    const password = req.body.password;
    const hashedPassword = hash(password, req.salt); //hash the user provided password with the gotten salt
    if(req.user.password.password === hashedPassword.hash){
        //Generate a login token for the user
        jwt.sign({
            name: req.user.name,
            email: req.user.email,
            number: req.user.number,
            _id: req.user.id,
            created: req.user.created
        }, process.env.JWT_KEY, {expiresIn: '30d'}, (err, token) => {
            if(err){
                res.json({
                    success: false,
                    error: err
                })
            }
            else{
                req.token = token;
                next();
            }
        });
    }
    else{
        res.status(550).json({
            success: false,
            payload: null,
            error: {
                code: 550,
                message: "Wrong email or password provided"
            }
        })
    }
}


module.exports = app;