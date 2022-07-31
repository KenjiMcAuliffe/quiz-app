const Quiz = require('../models/quizModel');
const User = require('../models/userModel');

const asyncHandler = require('express-async-handler');
const { default: mongoose } = require('mongoose');

const getQuizzes = asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
})

const getMyQuizzes = asyncHandler(async (req, res) => {
    const myQuizzes = await Quiz.find({ user: req.user.id })
    res.status(200).json(myQuizzes)
})

const createQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.create({
        title: req.body.title,
        category: req.body.category,
        user: req.user.id,
        questions: req.body.questions,
    })

    res.status(200).json(quiz);
})

const getQuiz = asyncHandler(async (req, res) => {
    const idString = req.params.id;
    var id;

    try {
        id = mongoose.Types.ObjectId(idString)
    } 
    catch (error) {
        res.status(400)

        throw new Error("A quiz matching that ID was not found")
    }
    
    const quiz = await Quiz.findById(id)

    if(!quiz) {
        res.status(400)
        throw new Error("A quiz matching that ID was not found")
    }

    res.status(200).json(quiz);
})

const updateQuiz = asyncHandler(async (req, res) => {

    //Check if quiz exists matching the id in the request
    const quiz = await Quiz.findById(req.params.id)
    if(!quiz) {
        res.status(400)
        throw new Error("A quiz matching that ID was not found")
    }

    //Check if user exists in request (assigned in authMiddleware)
    if(!req.user) {
        res.status(401)
        throw new Error("A user matching the id of the JWT token was not found.");
    }

    //Check that logged in user matches the quiz's user.
    if(quiz.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("Logged in user is not the creator of quiz.")
    }

    //Update the quiz
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {new: true})

    res.status(200).json(updatedQuiz);
})

const deleteQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id)

    if(!quiz) {
        res.status(400)
        throw new Error("A quiz matching that ID was not found")
    }

    //Check if user exists in request (assigned in authMiddleware)
    if(!req.user) {
        res.status(401)
        throw new Error("A user matching the id of the JWT token was not found.");
    }

    //Check that logged in user matches the quiz's user.
    if(quiz.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("Logged in user is not the creator of quiz.")
    }
    
    await quiz.remove();

    res.status(200).json({id: req.params.id})
})

module.exports = { getQuizzes, getMyQuizzes, createQuiz, getQuiz, updateQuiz, deleteQuiz };