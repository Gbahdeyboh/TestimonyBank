const express = require('express');
const app = express();
 
const mongooseConnect = require('./config/mongo');

const signupAuth = require('./auth/signup');

app.use(express.json());
app.use('/api', signupAuth);

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