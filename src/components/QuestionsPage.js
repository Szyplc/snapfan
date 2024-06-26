import React, { useEffect, useState } from "react";
import { Grommet, Heading, Box, Text, CheckBox, Card } from "grommet";
import axios from "axios";
import store, { getSelectedSurveys, getQuestionPageSurveys, updateQuestionPageSurveys, updateSolvedSurveyByUserId, getSolvedSurveyByUserId } from '../store';
import NavigationBar2 from "./NavigationBar2";
import Footer2 from "./Footer2";
import queryString from 'query-string';
import { useLocation } from "react-router-dom";
import './QuestionsPage.css'; // importowanie pliku CSS
import { useParams } from "react-router-dom";
import { LanguageContext } from "../LanguageProvider";

const QuestionsPage = () => {
  const { search } = useLocation();
  const [questionPageSurveys, setQuestionPageSurveys] = useState(getQuestionPageSurveys());
  const solvedsurveybyusersId = useParams();
  const { language, setLanguage, translate } = React.useContext(LanguageContext);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setQuestionPageSurveys(getQuestionPageSurveys());
    });

    return () => {
      unsubscribe();
    };
  }, []);


  useEffect(() => {

    
    const fetchQuestionPageSurveys = async () => {
      try {
        //const searchParams = new URLSearchParams(search);
       // const solvedsurveybyusersId = searchParams.get("solvedsurveybyusersId");

        let response

        const selectedSurveys = getSelectedSurveys();
        console.log(selectedSurveys)
        if(solvedsurveybyusersId && solvedsurveybyusersId.solvedsurveybyusersId){
          console.log(solvedsurveybyusersId)
          const link = `http://127.0.0.1:3001/surveys-from-user/${solvedsurveybyusersId.solvedsurveybyusersId}`;
          response = await axios.get(link);
          const selectedSurveys2 = response.data.surveys
          console.log(link)


          store.dispatch(updateSolvedSurveyByUserId(response.data._id));

          console.log(getSolvedSurveyByUserId())
          //console.log("getSolvedSurveyByUserId")

          const selectedSurveysIds = selectedSurveys2
          const link2 = `http://127.0.0.1:3001/surveys/${selectedSurveysIds.join()}`;
          response = await axios.get(link2);
          console.log(response)

          

        }else{
            const selectedSurveysIds = selectedSurveys.map(survey => survey._id);
            console.log(selectedSurveysIds.join())
            const link = `http://127.0.0.1:3001/surveys/${selectedSurveysIds.join()}`;
              console.log(link);
            response = await axios.get(link);
        }

  
        
        store.dispatch(updateQuestionPageSurveys(response.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchQuestionPageSurveys();
  }, []);

  const handleCheckBoxChange = (survey, questionIndex, checked) => {
    const updatedSurveys = [...questionPageSurveys];
    updatedSurveys[questionPageSurveys.indexOf(survey)].questions[
      questionIndex
    ].answer = checked;
    setQuestionPageSurveys(updatedSurveys);
  };

  return (
    <Grommet>
      <NavigationBar2 />
      <Box pad="medium" style={{marginTop: 55}}>
        {questionPageSurveys.map((survey) => (
          <Box key={survey._id} margin={{ vertical: "medium" }}>
            <Heading className="header" level={3}>{language == "en" ? survey.title : survey.title_pl}</Heading>
            {survey.questions.map((question, questionIndex) => {
              const cardClass = question.answer === true ? "answered-yes" : question.answer === false ? "answered-no" : "";

              return (
              <Box key={question._id} margin={{ vertical: "small" }} className="center-box" onClick={() => {
                  const updatedSurveys = [...questionPageSurveys];
                  updatedSurveys[questionPageSurveys.indexOf(survey)].questions[questionIndex].answer = !question.answer;
                  setQuestionPageSurveys(updatedSurveys);
              }}>
                <Card className={question.answer === true ? "answered-yes" : question.answer === false ? "answered-no" : cardClass} background="light-1" pad="medium" >
                  <Text className="text">{language == "en" ? question.question : question.question_pl}</Text>
                  <div className="answer-container">
                    <CheckBox
                      label={language == "en" ? "Yes" : "Tak"}
                      checked={question.answer === true}
                      onChange={(e) => handleCheckBoxChange(survey, questionIndex, e.target.checked)}
                    />
                    <CheckBox
                      label={language == "en" ? "No" : "Nie"}
                      checked={question.answer === false}
                      onChange={(e) => handleCheckBoxChange(survey, questionIndex, !e.target.checked)}
                    />
                  </div>
                </Card>
              </Box>
           
              );
            })}
          </Box>
        ))}
      </Box>
      <Footer2 />
    </Grommet>
  );
};

export default QuestionsPage;


// import React, { useEffect, useState } from "react";
// import { Grommet, Heading, Box, Text, CheckBox, Card } from "grommet";
// import axios from "axios";
// import store, { getSelectedSurveys, getQuestionPageSurveys, updateQuestionPageSurveys, updateSolvedSurveyByUserId, getSolvedSurveyByUserId } from '../store';
// import NavigationBar2 from "./NavigationBar2";
// import Footer2 from "./Footer2";
// import queryString from 'query-string';
// import { useLocation } from "react-router-dom";
// import './QuestionsPage.css'; // importowanie pliku CSS
// import { useParams } from "react-router-dom";

// const QuestionsPage = () => {
//   const { search } = useLocation();
//   const [questionPageSurveys, setQuestionPageSurveys] = useState(getQuestionPageSurveys());
//        const solvedsurveybyusersId = useParams();

//   useEffect(() => {
//     const unsubscribe = store.subscribe(() => {
//       setQuestionPageSurveys(getQuestionPageSurveys());
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);


//   useEffect(() => {

    
//     const fetchQuestionPageSurveys = async () => {
//       try {
//         //const searchParams = new URLSearchParams(search);
//        // const solvedsurveybyusersId = searchParams.get("solvedsurveybyusersId");

//         let response
//         console.log(solvedsurveybyusersId)

//         const selectedSurveys = getSelectedSurveys();
//         if(solvedsurveybyusersId && solvedsurveybyusersId.solvedsurveybyusersId){

//           const link = `https://snapfun.io:3001/surveys-from-user/${solvedsurveybyusersId.solvedsurveybyusersId}`;
//           response = await axios.get(link);
//           const selectedSurveys2 = response.data.surveys
//           console.log(link)


//           store.dispatch(updateSolvedSurveyByUserId(response.data._id));

//           console.log(getSolvedSurveyByUserId())
//           //console.log("getSolvedSurveyByUserId")

//           const selectedSurveysIds = selectedSurveys2
//           const link2 = `https://snapfun.io:3001/surveys/${selectedSurveysIds.join()}`;
//           response = await axios.get(link2);
//           console.log(response)

          

//         }else{
//            const selectedSurveysIds = selectedSurveys.map(survey => survey._id);
//            const link = `https://snapfun.io:3001/surveys/${selectedSurveysIds.join()}`;
//            response = await axios.get(link);
//         }

  
        
//         store.dispatch(updateQuestionPageSurveys(response.data));
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchQuestionPageSurveys();
//   }, []);

//   const handleCheckBoxChange = (survey, questionIndex, checked) => {
//     const updatedSurveys = [...questionPageSurveys];
//     updatedSurveys[questionPageSurveys.indexOf(survey)].questions[
//       questionIndex
//     ].answer = checked;
//     setQuestionPageSurveys(updatedSurveys);
//   };

//   return (
//     <Grommet>
//       <NavigationBar2 />
//       <Box pad="medium">
//         {questionPageSurveys.map((survey) => (
//           <Box key={survey._id} margin={{ vertical: "medium" }}>
//             <Heading level={3}>{survey.title}</Heading>
//             {survey.questions.map((question, questionIndex) => {
//               const cardClass = question.answer === true ? "answered-yes" : question.answer === false ? "answered-no" : "";

//               return (

//                 <Box key={question._id} margin={{ vertical: "small" }} className="center-box">
//                 <Card className={question.answer === true ? "answered-yes" : question.answer === false ? "answered-no" : cardClass} background="light-1" pad="medium" >
//                   <Text className="text">{question.question}</Text>
//                   <div className="answer-container">
//                     <CheckBox
//                       label="Yes"
//                       checked={question.answer === true}
//                       onChange={(e) =>
//                         handleCheckBoxChange(survey, questionIndex, e.target.checked)
//                       }
//                     />
//                     <CheckBox
//                       label="No"
//                       checked={question.answer === false}
//                       onChange={(e) =>
//                         handleCheckBoxChange(survey, questionIndex, !e.target.checked)
//                       }
//                     />
//                   </div>
//                 </Card>
//               </Box>
                          
//               );
//             })}
//           </Box>
//         ))}
//       </Box>
//       <Footer2 />
//     </Grommet>
//   );
// };

// export default QuestionsPage;
