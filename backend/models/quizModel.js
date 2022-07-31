const mongoose = require('mongoose')

const quizSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        answers: [{
            type: String,
            required: true
        }]
    }]
})

module.exports = mongoose.model('Quiz', quizSchema, 'quizzes')