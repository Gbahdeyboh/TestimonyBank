const express = require('express');
const app = express();

const userModel = require('../models/users');

app.get('/users', (req, res, next) => { //returns a list of all users
    userModel.find()
    .then(profile => {
        //delete password object before sending response back to the client
        profile.forEach(data => {
            delete data.password.salt; //delete the password salt
            delete data.password.password; //delete the password itself
            delete data.password; //delete the password Object
        });
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
});

app.delete('/delete/:id', (req, res) => {
    userModel.findByIdAndRemove(req.params.id)
    .then(data => {
        res.status(200).json({
            success: true,
            payload: {
                message: `Successfully deleted user ${req.params.id}`,
                data: data
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            payload: null,
            error: {
                code: 500,
                message: "An error occurred"
            }
        });
    })
})

module.exports = app;