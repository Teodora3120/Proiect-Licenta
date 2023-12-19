const mongoose = require('mongoose');

const supportQuestionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    userFullname: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: false,
    }
},
    {
        timestamps: true
    });

const SupportQuestion = mongoose.model('SupportQuestion', supportQuestionSchema);

module.exports = SupportQuestion;
