const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

const postUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if(!name || !email || !password) {
        res.status(400)
        throw new Error("The incorrect credentials were provided (name, email, and password are required)")
    }

    const userExists = await User.findOne({email})
    if(userExists) {
        res.status(400)
        throw new Error("A user already exists with this email")
    }
    else {
        //Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        if(user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            })
        } else {
            res.status(400)
            throw new Error("Invalid user data");
        }
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    //Check for user email
    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid credentials")
    }
})

const getMe = asyncHandler(async (req, res) => {
    const {_id, name, email} = await User.findById(req.user.id)

    res.status(200).json({
        _id: _id,
        name: name,
        email: email
    })
})

//Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = { postUser, loginUser, getMe }