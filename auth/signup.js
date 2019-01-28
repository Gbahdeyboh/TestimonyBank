const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const userModel = require('../models/users');

const hash = require('./hash'); //pasword hashing module


app.post('/signup', (req, res, next) => {
    //check if user already exists
    console.log("The body is : ", req.body);
    userModel.find({email: req.body.email})
    .then(doc => {
        if(doc.length >= 1){ 
            //if user exists, don't create account
            res.status(550).json({
                success: false,
                payload: null, 
                error: {
                    code: 550,
                    message: "The email account is already registered with another account"
                }
            });
        }
        else{
            //if user doesn't exist, create account
            const password = req.body['password']; //Get users password from request body
            const hashedPassword = hash(password) // hash the users password
            req.body['password'] = { //set the users password to an object containing the salt and the hashed password
                salt: hashedPassword.salt,
                password: hashedPassword.hash
            }
            userModel.create(req.body)
            .then(profile => {
                delete profile.password.salt; //delete the salt before send it back to the client
                delete profile.password.password; //delete the hashed password before sending it back to the client
                delete profile.password; //delete the password Object before sending it back to the client
                //Generate a json web token so user is automatically logged in after signup
                const token = jwt.sign({
                    name: profile.name,
                    email: profile.email,
                    number: profile.number,
                    _id: profile.id,
                    created: profile.created
                }, process.env.JWT_KEY, {expiresIn: '30d'});
                res.status(200).json({
                    success: true,
                    payload: {
                        data: profile,
                        token
                    }
                })
            })
            .catch(err => {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 500,
                        message: "Did not create user check the request body",
                        error: err
                    }
                })
            })
        }
    })
    .catch(err=> {
        res.status(500).json({
            success: false,
            error: err
        });
    });

});


module.exports = app;