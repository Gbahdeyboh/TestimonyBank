
// middleware function to verify the received token, would be used later

// function verifyToken(req, res, next){
//     const authorizationHeader = req.headers['authorization']; //Authorization headers
//     if(authorizationHeader){
//         const token = authorizationHeader.split(' ').pop();
//         //Verify token with jwt
//         jwt.verify(token, process.env.JWT_KEY, (err, token) => {
//             if(err){
//                 res.status(401).json({
//                     success: false,
//                     payload: null,
//                     error: {
//                         code: 401,
//                         message: "Invalid token parsed",
//                         err: err
//                     }
//                 })
//             }
//             else if(token){
//                 req.tokenId = token._id;
//             }
//         });
//         next(); //call the next middleware
//     }
//     else{ 
//         //If Authorization headers are not sent
//         res.status(400).json({
//             success: false,
//             payload: null,
//             error: {
//                 code: 401,
//                 message: "Invalid request headers: Authorization missing in request header",
//             }
//         });
//     }
// }