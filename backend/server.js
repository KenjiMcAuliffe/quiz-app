const express = require('express');
const dotenv = require('dotenv').config();
const {errorHandler} = require('./middleware/errorMiddleware')
const port = process.env.PORT;
const app = express();

const connectDB = require('./config/db')
connectDB();

//Allows express to accept body in request
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.send("Landing page");
});

app.use('/api/quizzes', require('./routes/quizRoutes'));

app.use('/api/users', require('./routes/userRoutes'))

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});