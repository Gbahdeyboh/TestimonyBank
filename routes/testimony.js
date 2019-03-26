const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

const testimoniesModel = require('../models/testimony');


//Get posted testimonies
app.get('/testimony/get', verifyToken, (req, res, next) => {
    const page = req.query.page;
    if(page){ //if a page is specified
        testimoniesModel.paginate({}, {page : parseInt(page), limit: parseInt(3)})
        .then(response => {
            const pageNo = response.pages //Number of pages
            const lastPage = (pageNo + 1) - page; //select the page from behind to get most recently added records
            testimoniesModel.paginate({}, {page : parseInt(lastPage), limit: parseInt(3)})
            .then(testimony => {
                const pageNo = testimony.pages //Number of pages
                const lastPage = (pageNo + 1) - page; //select the page from behind to get most recently added records
                if(testimony.docs.length > 0){
                    res.status(200).json({
                        success: true,
                        payload: {
                            message: "Testimonies gotten successfully",
                            data: testimony.docs.reverse()
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
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                payload: null,
                err: {
                    message: `Could not fetch testimonies, something went wrong`,
                    error: err
                }
            })
        })
    }
    else if(req.query.postersId){
        testimoniesModel.find({'postersId': req.query.postersId})
        .then(response =>{
            res.json({
                success: true,
                payload: response
            });
        })
        .catch(err => {
            res.json({
                success: false,
                payload: null,
                err: {
                    code: 404,
                    message: `Could not fetch testimonies of the specified user`,
                    error: err
                }
            });
        })
    }
});

app.get('/testimony/get/:id', verifyToken, (req, res, next) => {
    /*
    * If an id is specified in request parameters
    * Respond with the specified testimony
    */
    const id = req.params.id;
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
});

//get just the titles of testimonies posted by a specific user

app.get('/testimony/get/title', verifyToken, (req, res, next) => {
    const data = req.body;
    testimoniesModel.find(data)
    .then(response => {
        res.send(response);
        console.log(response);
    })
    .catch(err => {
        res.send(err);
    });
})


//Get posted comments
app.get('/testimony/comment/get/:id', verifyToken, (req, res, next) => {
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
        res.status(400).json({
            success: false,
            payload: null,
            err: {
                message: `Could not get comments with id ${id}`,
                error: err
            }
        })
    })
});

app.get('/testimony/search', verifyToken, (req, res, next) => {
    const query = req.query.q;
    testimoniesModel.find({title: { $regex: query, $options: 'i' }}) //$text: { $search: query }
    .then(responses => {
        /**
         * @desc 
         * The mongoose returns an array of objects
         * We loop through this array and extract the essentials from this data
         * Each data extracted is pushed into a new Array 'datas'
         * This new Array is what is sent back to the client
         */
        let datas = [];
        for (response in responses){
            let data = {
                postersId: responses[response].postersId,
                postersName: responses[response].postersName,
                title: responses[response].title,
                testimony: responses[response].testimony,
                datePosted: responses[response].datePosted,
                _id: responses[response]._id
            }
            datas.push(data);
        }
        console.log("response is ", datas);
        res.json({
            success: true,
            payload: {
                message: `fetched results for {${query}}`,
                data: datas
            }
        });
    })
    .catch(err => {
        res.json({err});
    })
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
    console.log("testimony id is ", testimonyId);
    testimoniesModel.findById(testimonyId)
    .then(data => {
        const likes = data.likes;
        const ifLiked = likes.some((val) => {
            if(val === likerId){
                console.log('Sent val is ', likerId);
                console.log('compared val is ', val);
                return true;
            }
        })
        if(ifLiked){
            //Testimony has been liked already
            console.log("likes are \n", testimonyId);
            console.log("liker is \n", likerId);
            res.status(401).json({
                success: false,
                payload: null,
                err: {
                    code: 401,
                    message: "This testimony has already been liked by the user"
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