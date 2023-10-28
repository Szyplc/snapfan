const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const https = require('https');
const fs = require('fs');



// Schemas and Models
const {
    Survey,
    SolvedSurvey,
    SolvedSurveyByUser,
    User,
    MatchedQuestionsInSurveys,
    Review
} = require('./Schemas/schemas');


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//mongodb://localhost/surveyApp
mongoose.connect('mongodb+srv://kzyzulek:Test123@cluster0.opyzrkj.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to database!');
});

// Create a new review
app.post('/review', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).send(review);
  } catch (error) {
    res.status(400).send(error);
  }
});


app.get('/matchedquestionsinsurveys/:id', async function (req, res) {
  const existingSurvey = await MatchedQuestionsInSurveys.findOne({
    _id: req.params.id
});
  res.send(existingSurvey);
});

// Endpoints
app.get('/', function (req, res) {
    res.send('Hello World!');
});


app.post('/solved-surveys', async (req, res) => {
  const { userId } = req.body;
  
  try {
    const user = await User.findById(userId).populate('SolvedSurveyByUser');
    const solvedSurveyByUser = user.SolvedSurveyByUser;
    
    const solvedSurveys = await SolvedSurvey.find({
      _id: { $in: solvedSurveyByUser.flatMap(ssbu => ssbu.solvedSurveys) }
    }).populate('surveys');
    
    const result = [];
    
    for (const solvedSurvey of solvedSurveys) {
      const survey = await Survey.findById(solvedSurvey.surveys);
      
      const answersWithQuestions = solvedSurvey.answers.map(answer => {
        const question = survey.questions.find(q => q._id.toString() === answer.questionId.toString());
        return {
          questionId: answer.questionId,
          answer: answer.answer,
          questionText: question.question
        };
      });

      result.push({
        surveyTitle: survey.title,
        answers: answersWithQuestions
      });
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching solved surveys' });
  }
});




app.get('/send-email', function (req, res) {


// Tworzenie transportera SMTP
try{
    let transporter = nodemailer.createTransport({
        host: 'pro3.mail.ovh.net',
        port:587,
        secure: true, // Use SSL/TLS
        auth: {
          // user: 'postmaster@snapfun.io', // adres email
          // pass: 'test123!@' // hasło do konta email

            user: 'snapfan@snapfan.com', // adres email
            pass: 'kYssex-fygvy7-zarziq' // hasło do konta email
        }
    });

    // Ustawianie opcji wysyłki email
    let mailOptions = {
        from: 'snapfan@snapfun.io', // adres email nadawcy
        to: 'kzyzulek@gmail.com', // adres email odbiorcy
        subject: 'Testowy email', // temat emaila
        text: 'To jest testowy email wysłany za pomocą Node.js!' // treść emaila
    };

    // Wysyłanie emaila
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.send(error);

        } else {
            console.log('Email został wysłany: ' + info.response);
            res.send('Email został wysłany: ' + info.response);

        }
    });

  }catch{}
});



//endpint to answear survey
app.post('/survey/:surveyId/response', async (req, res) => {
    try {
        const {
            surveyId
        } = req.params;
        const {
            name,
            answers
        } = req.body;
        const survey = await Survey.findById(surveyId);
        if (!survey) {
            return res.status(404).json({
                message: 'Survey not found'
            });
        }
        const response = new SurveyResponse({
            name,
            survey: surveyId,
            answers
        });
        await response.save();
        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});
// Endpoint to create a new survey


app.post('/surveys', async (req, res) => {
    const { title, questions } = req.body;
    const survey = new Survey({
      title,
      questions: questions.map((question) => ({ question: question, answer: null })),
    });

        // Check if survey with given title already exists
        const existingSurvey = await Survey.findOne({
            title: title
        });
        if (existingSurvey) {
            return res.status(400).json({
                error: "Survey with this title already exists"
            });
        }
    try {
      const result = await survey.save();
      res.send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });




app.get('/surveys-from-user/:solvedsurveybyusersId', async (req, res) => {
    
        try {

         const result = await SolvedSurveyByUser.aggregate([
            {
            $match: {
                _id: new mongoose.Types.ObjectId(req.params.solvedsurveybyusersId),
            },
            },
            {
            $unwind: "$solvedSurveys"
            },
            {
            $lookup: {
                from: "solvedsurveys",
                localField: "solvedSurveys",
                foreignField: "_id",
                as: "solved",
            },
            },
            {
            $unwind: "$solved"
            },
            {
                $group: {
                    _id: "$_id",
                    surveys: { $addToSet: "$solved.surveys" },
                }
            }
        ]);

          res.status(200).json(result[0]);
        } catch (err) {
          console.error(err);
          res.status(400).json(err);
        }

})

//Endpoint to get surveys 
app.get('/surveys/:ids?', async function (req, res) {
    try {
      const ids = req.params.ids ? req.params.ids.split(',') : null;
      const titleOnly = req.query.title === 'true';
      let fields = 'title questions title_pl';
      if (titleOnly) {
        fields = 'title title_pl';
      }
      let surveys;
      if (ids) {
        surveys = await Survey.find({ _id: { $in: ids } }, fields);
      } else {
        surveys = await Survey.find({}, fields);
      }
  
      res.status(200).json(surveys);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Error getting surveys');
    }
  });




app.post('/generate-link', async (req, res) => {
    try {
        console.log(req.body.responses)

      const { name, email, responses } = req.body;
      responses.surveyId = responses._id 

  
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({ email, name });
      }
  
      const surveyIds = responses.map((response) => response._id);
  
      // Find all surveys by their ids
      const surveys = await Survey.find({ _id: { $in: surveyIds } });
  
      // Check if all surveys exist
      if (surveys.length !== surveyIds.length) {
        return res.status(404).json({
          message: 'One or more surveys not found',
        });
      }
  
      const solvedSurveys = await Promise.all(
        responses.map(async (response) => {
          const survey = surveys.find((s) => s.id === response._id);
          const solvedSurvey = await SolvedSurvey.create({
            surveys: survey.id,
            userSenderId: user.id,
          });
          return solvedSurvey;
        })
      );
      
  
   

      const newSolvedSurveysByUser = new SolvedSurveyByUser({ userSenderId: user.id });
      const link = `https://snapfan.io/questions/${newSolvedSurveysByUser._id}`;

      
      newSolvedSurveysByUser.solvedSurveys = solvedSurveys.map((survey) => survey.id);
      newSolvedSurveysByUser.link = link;

      await newSolvedSurveysByUser.save();

      user.SolvedSurveyByUser.push(newSolvedSurveysByUser);
    await user.save();
  
      const savedResponses = await Promise.all(
        responses.map(async (response, index) => {
          const survey = surveys.find((s) => s.id === response._id);
          const solvedSurvey = solvedSurveys[index];
 
          solvedSurvey.answers = response.questions.map((answer) => ({
            questionId: answer._id,
            answer: answer.answer,
            question: answer.question,
          }));


  
          await solvedSurvey.save();
  
  
          return ;
        })
      );
  
      return res.status(201).json({"link":newSolvedSurveysByUser.link});
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  });
  app.post('/compare-survey-answers', async (req, res) => {


    //Zapisanie przychodzącej ankiety

    try{
      console.log(req.body.responses)

      const { name, email, responses } = req.body;
      responses.surveyId = responses._id 

  
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({ email, name });
      }
  
      const surveyIds = responses.map((response) => response._id);
  
      // Find all surveys by their ids
      const surveys = await Survey.find({ _id: { $in: surveyIds } });
  
      // Check if all surveys exist
      if (surveys.length !== surveyIds.length) {
        return res.status(404).json({
          message: 'One or more surveys not found',
        });
      }
  
      const solvedSurveys = await Promise.all(
        responses.map(async (response) => {
          const survey = surveys.find((s) => s.id === response._id);
          const solvedSurvey = await SolvedSurvey.create({
            surveys: survey.id,
            userSenderId: user.id,
          });
          return solvedSurvey;
        })
      );
      
  
   

      const newSolvedSurveysByUser = new SolvedSurveyByUser({ userSenderId: user.id });
      const link = `https://snapfan.io/questions?solvedsurveybyusersId=${newSolvedSurveysByUser._id}`;

      
      newSolvedSurveysByUser.solvedSurveys = solvedSurveys.map((survey) => survey.id);
      newSolvedSurveysByUser.link = link;

      await newSolvedSurveysByUser.save();

      user.SolvedSurveyByUser.push(newSolvedSurveysByUser);
    await user.save();
  
      const savedResponses = await Promise.all(
        responses.map(async (response, index) => {
          const survey = surveys.find((s) => s.id === response._id);
          const solvedSurvey = solvedSurveys[index];
 
          solvedSurvey.answers = response.questions.map((answer) => ({
            questionId: answer._id,
            answer: answer.answer,
            question: answer.question,
          }));


  
          await solvedSurvey.save();
  
  
          return ;
        })
      );
  
   


    //Porównanie i zapisanie do bazy danych matchujących odpowiedzi

      

        try {
            const { name, email, solvedSurveyByUserId, responses } = req.body;
            
            // Find user A or create a new one if not found
            let userA = await User.findOne({ email });
            if (!userA) {
              userA = await User.create({ email, name });
            }
        
            const solvedSurveysByUserA = await SolvedSurveyByUser.findById(solvedSurveyByUserId);
        
            // Find all surveys by their ids
            const surveyIds = responses.map((response) => response._id);
            const surveys = await Survey.find({ _id: { $in: surveyIds } });
        
            // Check if all surveys exist
            if (surveys.length !== surveyIds.length) {
              return res.status(404).json({
                message: 'One or more surveys not found',
              });
            }
        
            // Find the solved surveys for user B
          //  const solvedSurveysByUserB = await SolvedSurveyByUser.findById(solvedSurveyByUserId).populate('solvedSurveys');
        
          let solvedSurveysByUserB = await SolvedSurveyByUser.aggregate([
            {
            $match: {
                _id: new mongoose.Types.ObjectId(solvedSurveyByUserId),
            },
            },
            {
            $unwind: "$solvedSurveys"
            },
            {
            $lookup: {
                from: "solvedsurveys",
                localField: "solvedSurveys",
                foreignField: "_id",
                as: "solvedSurveys",
            },
            },
            {
                $group: {
                    _id: "$_id",
                    solvedSurveys: { $push: "$solvedSurveys" }
                }
            }
        ]);




        let userB = await SolvedSurveyByUser.aggregate([
          {
          $match: {
              _id: new mongoose.Types.ObjectId(solvedSurveyByUserId),
          }
        },{
          $lookup: { 
            from: "users",
            localField: "userSenderId",
            foreignField: "_id",
            as: "user"
          },
          }
      ]);

         solvedSurveysByUserB = solvedSurveysByUserB[0]
        console.log(solvedSurveysByUserB)
            const matchedQuestions = [];
        
            // Compare answers between user A and user B for each survey
            responses.forEach((responseA) => {
              const responseB = solvedSurveysByUserB.solvedSurveys.find((survey) => survey[0].surveys.toString() == responseA._id);
              const matchedQuestionsForSurvey = responseA.questions.filter((answerA) => {
                const answerB = responseB[0].answers.find((a) => a.questionId.toString() === answerA._id);
                
                //Porównanie ankiet jeeli obydwie się zgadzają na prawdę 
                return answerB  && answerA.answer === answerB.answer && answerA.answer == true;
              });
              if (matchedQuestionsForSurvey.length > 0) {
                matchedQuestions.push({
                  title: responseA.title,
                  surveyId: responseA._id,
                  questions: matchedQuestionsForSurvey,
                });
              }
            });
        
            // Save the matched questions and user ids in the matchedQuestionsInSurveys collection
            const matchedQuestionsInSurveys = await MatchedQuestionsInSurveys.create({
              userAId: userA.id,
              userBId: userB[0].userSenderId,
              surveys:surveyIds,
              matchedQuestions:matchedQuestions,
            });
        
  
            

            //Sending emails

            const transporter = nodemailer.createTransport({
              host: 'pro3.mail.ovh.net', // SMTP server hostname
              port: 587, // SMTP port for SSL/TLS (usually 465 for SSL)
              secure: 'tls', // Use SSL/TLS
              auth: {
                user: 'snapfan@snapfan.com', // Your email address
                pass: 'kYssex-fygvy7-zarziq', // Your email password or app-specific password
              },
            });
            
            console.log(matchedQuestionsInSurveys._id);
            const link = 'https://snapfan.io/answears/' + matchedQuestionsInSurveys._id;
            
            // Set email options
            const mailOptions = {
              from: 'snapfan@snapfan.com', // Sender's email address
              bcc: [userA.email, userB[0].user[0].email, 'kzyzulek@gmail.com'], // BCC recipients
              subject: 'Survey Results SnapFan.io', // Email subject
              text: 'Thank you for using Snapfan. Here is the link to the survey results. ' + link, // Email body
            };
            
            // Send the email
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.error(error);
                res.send(error);
              } else {
                console.log('Email został wysłany: ' + info.response);
                res.send('Email został wysłany: ' + info.response);
              }
            });


        
            return res.json({
              message: 'Solved surveys compared successfully',
            });
          } catch (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Server error',
            });
          }
        
    }catch(err){
        console.log(err)
    }

})


  app.post('/compare-survey-answers', async (req, res) => {
    try {
        const { name, email, responses, solvedSurveyByUserId } = req.body;
        const user = await User.findOne({ email }) || await User.create({ email, name });
    
        const surveyIds = responses.map(({ _id }) => _id);
        const surveys = await Survey.find({ _id: { $in: surveyIds } });
    
        if (surveys.length !== surveyIds.length) {
          return res.status(404).json({
            message: 'One or more surveys not found',
          });
        }
    
        const solvedSurveys = await Promise.all(responses.map(async ({ surveyId, answers }) => {
          const survey = surveys.find((s) => s.id === surveyId);
          const solvedSurvey = await SolvedSurvey.create({
            survey,
            user,
            answers,
          });
    
          return solvedSurvey;
        }));
    
        const solvedSurveyByUser = await SolvedSurveyByUser.findById(solvedSurveyByUserId);
        if (!solvedSurveyByUser) {
          return res.status(404).json({
            message: 'SolvedSurveyByUser not found',
          });
        }
        //const solvedSurveyByUserIdObject = mongoose.Types.ObjectId(solvedSurveyByUserId);

        const matchedQuestions = [];
        const { solvedSurveys: previousSolvedSurveys } = await SolvedSurveyByUser.findOne({ _id: {  solvedSurveyByUserId } });
        for (const previousSolvedSurvey of previousSolvedSurveys) {
          const previousSolvedSurveyAnswers = previousSolvedSurvey.answers.reduce((obj, { questionId, answer }) => ({ ...obj, [questionId]: answer }), {});
          const matchedQuestionsInSurvey = [];
          for (const { questionId, answer } of solvedSurveys.find(({ survey: { id } }) => id === previousSolvedSurvey.survey.id).answers) {
            if (previousSolvedSurveyAnswers[questionId] && answer) {
              matchedQuestionsInSurvey.push(questionId);
            }
          }
    
          if (matchedQuestionsInSurvey.length > 0) {
            matchedQuestions.push({
              survey: previousSolvedSurvey.survey,
              user: previousSolvedSurvey.user,
              matchedQuestions: matchedQuestionsInSurvey,
            });
          }
        }
    
        solvedSurveyByUser.solvedSurveys.push(...solvedSurveys);
        await solvedSurveyByUser.save();
    
        const newMatchedQuestions = await Promise.all(matchedQuestions.map(({ survey, user, matchedQuestions }) => MatchedQuestionsInSurvey.create({
          userA: user.id,
          userB: user.id === solvedSurveyByUser.user.id ? solvedSurveyByUser.userReceiverId : solvedSurveyByUser.userSenderId,
          survey: survey.id,
          matchedQuestions,
        })));
    
        res.status(200).json({
          message: 'Survey responses saved successfully',
          matchedQuestions: newMatchedQuestions,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({
          message: 'An error occurred while saving survey responses',
        });
      }
    
  })


  app.post('/compare-survey-answers', async (req, res) => {
    try {
        console.log(req.body.responses)

      const { name, email, responses } = req.body;
      responses.surveyId = responses._id 

  
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({ email, name });
      }
  
      const surveyIds = responses.map((response) => response._id);
  
      // Find all surveys by their ids
      const surveys = await Survey.find({ _id: { $in: surveyIds } });
  
      // Check if all surveys exist
      if (surveys.length !== surveyIds.length) {
        return res.status(404).json({
          message: 'One or more surveys not found',
        });
      }
  
      const solvedSurveys = await Promise.all(
        responses.map(async (response) => {
          const survey = surveys.find((s) => s.id === response._id);
          const solvedSurvey = await SolvedSurvey.create({
            surveys: survey.id,
            userSenderId: user.id,
          });
          return solvedSurvey;
        })
      );
      
  
   

      const newSolvedSurveysByUser = new SolvedSurveyByUser({ userSenderId: user.id });
      const token = crypto.randomBytes(32).toString('hex');

      const link = `https://snapfan.io:3000/questions?solvedsurveybyusersId=${newSolvedSurveysByUser._id}`;

      
      newSolvedSurveysByUser.solvedSurveys = solvedSurveys.map((survey) => survey.id);
      newSolvedSurveysByUser.link = link;

      await newSolvedSurveysByUser.save();

      user.SolvedSurveyByUser.push(newSolvedSurveysByUser);
    await user.save();
  
      const savedResponses = await Promise.all(
        responses.map(async (response, index) => {
          const survey = surveys.find((s) => s.id === response._id);
          const solvedSurvey = solvedSurveys[index];
  
          solvedSurvey.questions = response.questions.map((answer) => ({
            questionId: answer._id,
            answer: answer.answer,
            question: answer.question,
          }));
  
          await solvedSurvey.save();
  
  
          return ;
        })
      )}catch(err){
        console.log(err)
      };
      
   
    try {
      const { name, email, solvedSurveyByUserId, responses } = req.body;
      
      // Get the SolvedSurveyByUser object for the user who sent the request
      const solvedSurveyByUserA = await SolvedSurveyByUser.findById(solvedSurveyByUserId).populate('solvedSurveys');
      const userA = await User.findOne({ email });
  
      // Find other users who have answered the same surveys as userA
      const surveyIds = responses.map(response => response.surveyId);
      const usersWithMatchingSurveys = await SolvedSurveyByUser.find({ 
        _id: {  solvedSurveyByUserId },}).populate({
        path: 'solvedSurveys',
        match: { survey: { $in: surveyIds } }, // only populate surveys that the other user has answered
        populate: { path: 'questions.questionId' } // populate the questionId field of each question object
      });
  
      // For each matching user, compare their answers to userA's answers and find the questions they both answered "yes" to
      const matchedQuestions = [];
      for (const userB of usersWithMatchingSurveys) {
        const solvedSurveyByUserB = userB.solvedSurveys.find(solvedSurvey => surveyIds.includes(solvedSurvey.survey.toString()));
        const userBObj = await User.findById(userB.userSenderId);
  
        const matchingQuestions = solvedSurveyByUserA.surveys[0].questions.filter(questionA => {
          const questionB = solvedSurveyByUserB.surveys[0].questions.find(q => q.questionId._id.equals(questionA.questionId._id));
          return questionA.answer && questionB.answer;
        });
  
        matchedQuestions.push({
          userA: userA._id,
          userB: userBObj._id,
          solvedSurveyByUserA: solvedSurveyByUserA._id,
          solvedSurveyByUserB: userB._id,
          surveys: [solvedSurveyByUserA.surveys[0].surveys, solvedSurveyByUserB.surveys[0].surveys],
          questions: matchingQuestions
        });
      }
  
      // Save the matching questions to the database
      const savedMatches = await matchedQuestionsInSurveys.insertMany(matchedQuestions);
  
      res.status(200).json(savedMatches);
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while processing your request.');
    }
})
  





//Endpoint for Adding user

app.post('/user', async (req, res) => {
    try {
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  


try{
 const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/snapfan.io/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/snapfan.io/fullchain.pem')
  };
  // const options = {
  //   key: fs.readFileSync('./certificates/key.pem'),
  //   cert: fs.readFileSync('./certificates/cert.pem')
  // }
  const server = https.createServer(options, app);

  server.listen(3001, () => {
      console.log('Server started on port 3001');
  });


}catch(err){
  console.log(err)
  console.log("uruchomianie serwera lokalnie/bez https")

  app.listen(3001, () => {
    console.log('Server started on port 3001');

});
}

app.get('/surveys/:ids?', async function (req, res) {
  console.log("endpoint 1")
    try {
      var ids = req.params.ids ? req.params.ids.split(',') : null;
      var surveys;
      if (ids) {
        surveys = await Survey.find({ _id: { $in: ids } }, 'title questions title_pl');
      } else {
        surveys = await Survey.find({}, 'title questions title_pl');
      }

      res.status(200).json(surveys);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Error getting surveys');
    }
  });



app.get('/surveyslist', async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            return res.status(404).json({
                message: 'Ankieta o podanym ID nie została znaleziona'
            });
        }
        return res.json(survey);
    } catch (error) {
        return res.status(500).json({
            message: 'Błąd podczas pobierania ankiety',
            error
        });
    }
});
//Endpoint to particular survey
app.get('/surveys/:id', async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            return res.status(404).json({
                message: 'Ankieta o podanym ID nie została znaleziona'
            });
        }
        return res.json(survey);
    } catch (error) {
        return res.status(500).json({
            message: 'Błąd podczas pobierania ankiety',
            error
        });
    }
});

//Endpoint to create a new survey list
app.post('/surveylists', function (req, res) {
    const surveyList = new SurveyList({
        name: req.body.name,
        surveys: req.body.surveys,
    });

    surveyList.save(function (err, savedSurveyList) {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving survey list');
        }

        res.status(201).json(savedSurveyList);
    });
});

//Endpoint to get all survey lists
app.get('/surveylists', function (req, res) {
    Survey.find(function (err, surveys) {
        if (err) {
            console.error(err);
            return res.status(500).send('Error getting surveys');
        }

        res.status(200).json(surveys);
    });
});