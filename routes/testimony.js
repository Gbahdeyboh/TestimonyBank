const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

const testimoniesModel = require('../models/testimony');


//Get posted comments
app.get('/testimony/comment/get/:id', (req, res, next) => {
    const id = req.params.id;
    testimoniesModel.findById(id)
    .then(response => {
        res.status(200).json({
            success: true,
            payload: {
                message: "Loaded comments successfully",
                data: response.comments.reverse()
            }
        });
    })
    .catch(err => {
        res.send(err);
    })
});

//Get posted testimonies
app.post('/testimony/get', (req, res, next) => {
    /* 
    * If no id is specified in request body
    * Respond with all the testimonies
    */
    if(!req.body.id){
        testimoniesModel.find()
        .then(testimony => {
            if(testimony.length > 0){
                res.status(200).json({
                    success: true,
                    payload: {
                        message: "Testimonies gotten successfully",
                        data: testimony.reverse()
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
    }
    else{
        /*
        * If an id is specified in request body
        * Respond with the specified testimony
        */
        const id = req.body.id;
        console.log("The id is ", id);
        testimoniesModel.findById(id)
        .then(data => {
            res.status(200).json({
                success: true,
                payload: {
                    message: `Got testimony with id ${id}`,
                    data: data
                }
            });
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                payload: null,
                err: {
                    message: `Could not get testimony with id ${id}`,
                    error: err
                }
            })
        });
    }
    
});

//Post a testimony
app.post('/testimony/add', verifyToken, (req, res, next) => {
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

app.post('/testimony/comment/add', verifyToken, prepareComment, (req, res, next) => {
    const data = req.body;
    testimoniesModel.findByIdAndUpdate(data.testimonyId, {comments: req.comments}, {new: true})
    .then(response => {
        res.status(200).json({
            success: true,
            payload: {
                message: "Comment succesfully added",
                data: {
                    testimonyId: response._id,
                    testimonyTitle: response.title,
                    commentersId: data.commentersId,
                    commentersName: data.commentersName,
                    comment: data.comment
                }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            payload: {
                code: 500,
                err
            }
        });
    });
});

//Like a testimony
app.put('/testimony/like', verifyToken, verifyLike, (req, res) => {
    testimoniesModel.findByIdAndUpdate(req.body.testimonyId, {likes: req.likes}, {new: true})
    .then(data => {
        res.status(200).json({
            success: true,
            payload: {
                message: `Post successfully liked`,
                data
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            payload: null,
            err: {
                code: 500,
                err
            }
        })
    })
});


//Delete a testimony
app.delete('/testimony/delete/:id', (req, res, next) => {
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

//Make sure the testimony has not been liked before, if it hasn't prepare a like object
function verifyLike(req, res, next){
    const data = req.body;
    const testimonyId = data.testimonyId;
    const likerId = data.likerId;
    testimoniesModel.findById(testimonyId)
    .then(data => {
        const likes = data.likes;
        const ifLiked = likes.some((val) => {
            if(val === likerId) return true;
        })
        if(ifLiked){
            //Testimony has been liked already
            res.status(401).json({
                success: false,
                payload: null,
                err: {
                    code: 401,
                    message: "This testimony has alreay been liked by the user"
                }
            })
        }
        else{
            //Push the liker into the likes Array
            likes.push(likerId);
            req.likes = likes;
            next();
        }
    })
    .catch(err => {
        res.json({err});
    })
}

//Prepare a comment Object to be added to the comment collections comment 
function prepareComment(req, res, next){
    const data = req.body;
    const testimonyId = data.testimonyId;
    const comentersId = data.commentersId;
    const comment = data.comment;
    testimoniesModel.findById(testimonyId)
    .then(response => {
        let comments = response.comments;
        comments[0] === 0 ? (() => {comments.shift(); pushComment(comments)})() /*If a default value of  zero was stored as a comment*/ : pushComment(comments);
        async function pushComment(comments){
            await comments.push({
                commentersId: data.commentersId,
                commentersName: data.commentersName,
                comment: data.comment
            });
            req.comments = comments;
            next();
        }
    })
    .catch(err => {
        res.status.json({
            success: false,
            err: {
                code: 500,
                err
            }
        })
    })
}

//Make sure there is a token and verify the token before proceeding
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
                next(); //call the next middleware
            }
        });
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