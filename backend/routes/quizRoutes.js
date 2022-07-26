const express = require('express');
const { getQuizzes, getMyQuizzes, createQuiz, getQuiz, updateQuiz, deleteQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware')

const router = express.Router();

router.route('/')
    .get(getQuizzes)
    .post(protect, createQuiz);
router.get('/myquizzes', protect, getMyQuizzes)
router.route('/:id')
    .get(getQuiz)
    .put(protect, updateQuiz)
    .delete(protect, deleteQuiz)

module.exports = router;