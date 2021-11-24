////////////////////////
//  Dependencies
////////////////////////
//  Loading env variables
require('dotenv').config()
//  Loading json webtoken
const jwt = require('jsonwebtoken')

//  Middleware for authorization (making sure they are signed in)
const isLoggedIn = async (req, res, next) => {
    try {
        //  Check if auth header exists
        if (req.cookies.token) {
            //  Parse token from header
            //  Split the token and get the header
            const token = req.cookies.token
            if (token) {
                const payload = await jwt.verify(token, process.env.SECRET)
                if (payload) {
                    //  Store userdata in request object
                    req.user = payload
                    console.log(req.user)
                    next()
                } else {
                    res.status(400).json({ error: 'token verification failed'})
                }
            } else {
                res.status(400).json({ error: 'malformed auth header'})
            }
        } else {
            res.status(400).json({ error: 'no authorization header'})
        }
    } catch (error) {
        res.status(400).json({ error })
    }
}

//  Export custom middleware
module.exports = {
    isLoggedIn
}