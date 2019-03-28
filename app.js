const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const customEnv = require('custom-env').env();
const cors = require('cors');
 
const mongooseConnect = require('./config/mongo'); //connect to mongo database

const signupAuth = require('./auth/signup');

const signinAuth = require('./auth/signin'); 

const userRoute = require('./routes/users');

const testimoniesRoute = require('./routes/testimony');


app.use('/static', express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/testimony.html', (req, res) => {
    res.sendFile(path.join(__dirname, './public/testimony.html'));
});


app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.json());


//Enable cors
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
app.use('/api', signinAuth);
app.use('/api', userRoute);
app.use('/api', testimoniesRoute);

const crypto = require('crypto'); 




const port = 8500 || process.env.PORT;
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