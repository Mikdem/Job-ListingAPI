const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../model/users')


const protect = asyncHandler(async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]

            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            //Get user from the token   
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized')
        }
    }

    if(!token){
        return res.status(401).json({ error: 'Unauthorized' });
    }
})


// const protectAdmin = asyncHandler(async (req, res, next) => {
//     let token

//     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
//         try {
//             // Get token from header
//             token = req.headers.authorization.split(' ')[1]

//             //verify token
//             const decoded = jwt.verify(token, process.env.JWT_SECRET)

//             //Get user from the token   
//             const user = await User.findById(decoded.id).select('-password');

//             if (!user) {
//                 return res.status(401).json({ error: 'User not found' });
//             }
//             // Check if the user is an admin
//             if (user.role !== 'admin') {
//                 return res.status(403).json({ error: 'Access denied. Admins only.' });
//             }
            
//             req.user = user;
//             next();
//         } catch (error) {
//             console.log(error)
//             res.status(401)
//             throw new Error('Not authorized')
//         }
//     }

//     if(!token){
//         return res.status(401).json({ error: 'Unauthorized' });
//     }
// })

// Custom middleware to check if the user is an admin
function isAdmin(req, res, next) {
    // Assuming you have stored the user role in the request object after JWT verification
    if (req.user.role === 'admin') {
      next(); // User is an admin, allow access
    } else {
      res.status(403).json({ error: 'Forbidden' }); // User is not an admin, deny access
    }
}


// Custom middleware to check if the user is an admin
function isSuperAdmin(req, res, next) {
    // Assuming you have stored the user role in the request object after JWT verification
    if (req.user.role === 'superadmin') {
      next(); // User is an admin, allow access
    } else {
      res.status(403).json({ error: 'Forbidden' }); // User is not an admin, deny access
    }
  }

module.exports = { protect,  isAdmin, isSuperAdmin }