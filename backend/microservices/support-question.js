const express = require('express');
const app = express();
const User = require('../models/User');
const SupportQuestion = require('../models/SupportQuestion')

app.post('/create-question', async (req, res) => {
    try {
        const { userId, userEmail, userFullname, question } = req.body;

        if (!userId || !userEmail || !question || !userFullname) {
            return res.status(400).json('Missing required fields');
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const supportQuestion = new SupportQuestion({
            userId: user._id,
            userEmail,
            userFullname,
            question,
            answer: ""
        });

        const savedQuestion = await supportQuestion.save();

        res.status(201).json(savedQuestion);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


app.put('/answer-question', async (req, res) => {
    try {
        const { answer, questionId } = req.body;

        if (!answer || !questionId) {
            return res.status(400).json('Missing required fields');
        }

        const question = await SupportQuestion.findById(questionId);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        question.answer = answer;

        await question.save();

        res.status(200).json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

app.put('/edit-answer-question', async (req, res) => {
    try {
        const { answer, questionId } = req.body;

        if (!answer || !questionId) {
            return res.status(400).json('Missing required fields');
        }

        const question = await SupportQuestion.findById(questionId);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        question.answer = answer;

        await question.save();

        res.status(200).json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

app.get('/', async (req, res) => {
    try {
        const allQuestions = await SupportQuestion.find();
        res.status(200).json(allQuestions);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
})

app.listen(process.env.PORT_SUPPORT_QUESTION, () => {
    console.log(`Support-question microservice listening on port ${process.env.PORT_SUPPORT_QUESTION}`);
});

module.exports = app;