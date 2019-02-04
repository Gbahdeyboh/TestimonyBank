const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

const testimoniesModel = require('../models/testimony');

//Get posted testimonies
app.get('/getTestimony', verifyToken, (req, res, next) => {
    testimoniesModel.find()
    .then(testimony => {
        if(testimony.length > 0){
            res.status(200).json({
                success: true,
                payload: {
                    message: "Testimonies gotten successfully",
                    data: testimony
                }
            });
        }
        else{
            res.status(404).json({
                success: true,
                payload: null,
                err: {
                    code: 404,
                    message: "There are no testimonies to display yet, kindly share a testimony"
                }
            })
        }
    })
    .catch(err => {
        res.status(400).json({
            success: false,
            payload: null,
            err: {
                code: 400,
                err
            }
        })
    });
});


//Post a testimony
app.post('/addTestimony', verifyToken, (req, res, next) => {
    testimoniesModel.create(req.body)
    .then(data => {
        res.status(200).json({
            success: true,
            payload: {
                message: "Successfully created a new post",
                data
            }
        })
    })
    .catch(err => {
        res.status(400).json({
            success: false,
            payload: null,
            error: {
                code: 400,
                message: "Invalid request body",
                err
            }
        });
    })
});

app.delete('/deleteTestimony/:id', (req, res, next) => {
    testimoniesModel.findByIdAndRemove(req.params.id)
    .then(success => {
        res.json({
            success: true,
            data: success
        })
        .catch(err => {
            res.json({})
            success: false,
            err
        })
    })
})



function verifyToken(req, res, next){
    const authorizationHeader = req.headers['authorization']; //Authorization headers
    if(authorizationHeader){
        const token = authorizationHeader.split(' ').pop();
        //Verify token with jwt
        jwt.verify(token, process.env.JWT_KEY, (err, tokenData) => {
            if(err){
                res.status(401).json({
                    success: false,
                    payload: null,
                    error: {
                        code: 401,
                        message: "Invalid token parsed",
                        err: err
                    }
                })
            }
            else if(tokenData){
                req.tokenId = tokenData.id; //append token to request Object
            }
        });
        next(); //call the next middleware
    }
    else{ 
        //If Authorization headers are not sent
        res.status(400).json({
            success: false,
            payload: null,
            error: {
                code: 401,
                message: "Invalid request headers: Authorization missing in request header",
            }
        });
    }
}
module.exports = app;