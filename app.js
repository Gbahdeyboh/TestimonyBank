const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const customEnv = require('custom-env').env();
 
const mongooseConnect = require('./config/mongo');

const signupAuth = require('./auth/signup');

const userRoute = require('./routes/users');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        return res.status(200).json({});
    }
    next();
});

app.use('/api', signupAuth);
app.use('/api', userRoute);

const crypto = require('crypto'); 




const port = 4000 || process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));

//Success json message format
// {
//     "success": true,
//     "payload": {
//       /* Application-specific data would go here. */
//     }
//   }



//Error json message format
// {
//     "success": false,
//     "payload": {
//       /* Application-specific data would go here. */
//     },
//     "error": {
//       "code": 123,
//       "message": "An error occurred!"
//     }
//   }