const express = require('express');
const app = express();

const userModel = require('../models/users');

const hash = require('./hash'); //pasword hashing module

app.get('/users', (req, res, next) => { //returns a list of all users
    userModel.find()
    .then(profile => {
        res.json({
            success: true,
            payload: {
                data: profile
            }
        });
    })
    .catch(err => {
        res.json({
            success: false,
            payload: null,
            error: {
                code: 500,
                message: "An error Occured"
            }
        })
    })
})

app.post('/signup', (req, res, next) => {
    //check if user already exists
    userModel.find({email: req.body.email})
    .then(doc => {
        if(doc.length >= 1){ 
            //if user exists, don't create account
            res.status(550).json({
                success: false,
                payload: null, 
                error: {
                    code: 550,
                    message: "User already has an account with the provided mail"
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
                res.json({
                    success: true,
                    payload: {
                        message: "New user succesfully created",
                        data: profile
                    }
                })
            })
            .catch(err => {
                res.json({
                    success: false,
                    error: {
                        code: 500,
                        message: "Did not create user"
                    }
                })
            })
        }
    })
    .catch(err=> {
        res.json({
            success: false,
            error: err
        });
    });

});



module.exports = app;