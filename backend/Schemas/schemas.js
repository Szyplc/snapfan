const mongoose = require('mongoose');

const solvedSurveysByUserSchema = new mongoose.Schema({
  solvedSurveys: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SolvedSurvey'
  }],
  link: {
    type: String,
    required: false
  },
  userSenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  title_pl: {
    type: String,
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    question_pl: {
      type: String,
      required: false
    },
    answer: {
      type: Boolean,
      required: false
    }
  }]
});

const SolvedSurveySchema = new mongoose.Schema({
  surveys: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Survey.questions',
      required: true
    },
    answer: {
      type: Boolean,
      required: false //zmieniono z true
    },
    question:{
        type:String,
        required:false
    }
  }],
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: [{
    type: String,
    required: true
  }],
  SolvedSurveyByUser: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SolvedSurveyByUser',
    required:true
  }]
});

const matchedQuestionsInSurveysSchema = new mongoose.Schema({
  userAId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true
  },
  userBId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true
  },
  solvedSurveyByUserA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SolvedSurveyByUser',
    required:false
  }, 
   solvedSurveyByUserB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SolvedSurveyByUser',
    required:false
  },
  surveys:[{    
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required:true
  }],
  matchedQuestions: [{
    surveyId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Survey',
      required:true
    },
    title:{
      type:String,
      required:true
    },
    title_pl: {
      type: String,
      required: false
    },
    questions:[
    {
      //questionId
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Survey.questions',
      required: true
    },
    answer: {
      type: Boolean,
      required: true
    },
    question:{
        type:String,
        required:false
    }}
    ]
  }]
});

const reviewSchema = new mongoose.Schema({
  email: { type: String,},
  name: { type: String },
  what_do_you_like: { type: String },
  what_you_dont_like: { type: String },
  what_would_you_add: { type: String },
  do_you_want_dating_app: { type: String },
  leave_your_email_if_you_want_to_stay_in_touch: { type: String },
});

const Review = mongoose.model('Review', reviewSchema);
const Survey = mongoose.model('Survey', surveySchema);
const SolvedSurveyByUser = mongoose.model('SolvedSurveyByUser', solvedSurveysByUserSchema);
const MatchedQuestionsInSurveys = mongoose.model('matchedQuestionsInSurveys', matchedQuestionsInSurveysSchema);
const User = mongoose.model('User', userSchema);
const SolvedSurvey = mongoose.model('SolvedSurvey', SolvedSurveySchema);


module.exports = {
  MatchedQuestionsInSurveys,
  Survey,
  SolvedSurveyByUser,
  SolvedSurvey,
  User,
  Review
};


// const mongoose = require('mongoose');

// const surveySchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     questions: [{
//         question: {
//             type: String,
//             required: true
//         },
//         answerType: {
//             type: String,
//             enum: ['boolean', 'string'],
//             required: true
//         }
//     }],
//     language: {
//         type: String,
//         required: false
//     }
// });

// const Survey = mongoose.model('Survey', surveySchema);

// const solvedSurveySchema = new mongoose.Schema({
//     survey: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Survey',
//         required: true
//     },
//     link: {
//         type: String,
//         required: false
//     },
//     userSenderId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     answers: [{
//         question: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Survey.questions',
//             required: false
//         },
//         answer: {
//             type: mongoose.Schema.Types.Mixed,
//             required: true
//         }
//     }]
// });

// const SolvedSurvey = mongoose.model('SolvedSurvey', solvedSurveySchema);

// const userSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true
//     },
//     name: [{
//         type: String,
//         required: true
//     }],
//     solvedSurveys: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'SolvedSurvey'
//     }]
// });

// const User = mongoose.model('User', userSchema);

// module.exports = {
//     Survey,
//     SolvedSurvey,
//     User
// };


// const mongoose = require('mongoose');

// const surveySchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     questions: [{
//         question: {
//             type: String,
//             required: true
//         },
//         answer: {
//             type: Boolean,
//             required: false
//         }
//     }],
//     language: {
//         type: String,
//         required: false
//     }
// });

// const Survey = mongoose.model('Survey', surveySchema);


// const solvedSurveySchema = new mongoose.Schema({
//     surveys: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Survey'
//     }],
//     link: {
//         type: String,
//         required: true
//     },
//     userSenderId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     answers: [{
//         questionId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Survey.questions'
//         },
//         answer: {
//             type: Boolean,
//             required: false
//         }
//     }]
// });

// const SolvedSurvey = mongoose.model('SolvedSurvey', solvedSurveySchema);

// const userSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true
//     },
//     name: [{
//         type: String,
//         required: true
//     }],
//     solvedSurveys: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'SolvedSurvey'
//     }]
// });

// const User = mongoose.model('User', userSchema);

// module.exports = {
//     Survey,
//     SolvedSurvey,
//     User
// };
