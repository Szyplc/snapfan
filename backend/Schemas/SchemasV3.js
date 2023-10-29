const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    questions: {
        type: [String],
        required: true,
    },
    language: {
        type: String,
        required: false
    }
});

const Survey = mongoose.model('Survey', surveySchema);

const surveyListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surveys: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey'
    }],
});

const SurveyList = mongoose.model('SurveyList', surveyListSchema);

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    sentSurveys: [{
        surveyList: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SurveyList'
        },
        recipients: [{
            email: String,
            responded: {
                type: Boolean,
                default: false
            }
        }],
    }, ],
    receivedSurveys: [{
        survey: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Survey'
        },
        responses: [{
            email: String,
            answer: String
        }],
    }, ],
});

const User = mongoose.model('User', userSchema);


module.exports = {
    Survey,
    User,
    SurveyList
};