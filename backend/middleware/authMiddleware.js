const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
            next()
        }
        catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Invalid JWT token, unable perform this request.')
        }
    }

    //If theres no JWT Token in the HTTP request header.
    if(!token) {
        res.status(401)
        throw new Error('No JWT token in HTTP request headers, not authorized to perform this request')
    }
})

module.exports = { protect }