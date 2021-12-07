import expressJwt from 'express-jwt';
require('dotenv').config()

export const requireSignIn = expressJwt({
    secret : process.env.JWT_SECRET,
    algorithms: ["HS256"]
})