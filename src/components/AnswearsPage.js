import React, { useEffect, useState } from "react";
import { Grommet, Heading, Box, Text, CheckBox, Card } from "grommet";
import axios from "axios";
import store, { getSelectedSurveys, getQuestionPageSurveys, updateQuestionPageSurveys } from '../store';
import NavigationBar2 from "./NavigationBar2";
import Footer3 from "./Footer3";
import { useLocation } from "react-router-dom";
import './QuestionsPage.css'; // importowanie pliku CSS
import { useParams } from "react-router-dom";
import { LanguageContext } from "../LanguageProvider";

const AnswearPage = () => {
  const { search } = useLocation();
  const [questionPageSurveys, setQuestionPageSurveys] = useState(getQuestionPageSurveys());
  const surveyresults = useParams();
  const { language } = React.useContext(LanguageContext);

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
        const searchParams = new URLSearchParams(search);
       // const surveyresults = searchParams.get("surveyresults");
          const link = `https://snapfan.io:3001/matchedquestionsinsurveys/${surveyresults.surveyresults}`;
          let response = await axios.get(link);
          const solvedSurveys = response.data.matchedQuestions
        store.dispatch(updateQuestionPageSurveys(solvedSurveys));
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
      <Box pad="medium" >
        {questionPageSurveys.map((survey) => (
          <Box key={survey._id} margin={{ vertical: "large" }}>
            <Heading level={3}>{language == "en" ? survey.title : survey.title_pl}</Heading>
            {survey.questions.map((question, questionIndex) => {
              const cardClass = question.answer === true ? "answered-yes" : question.answer === false ? "answered-no" : "";

              return (
                
                <Box key={question._id} margin={{ vertical: "small" }}>
                  <Card
                    className={cardClass}
                    background="light-1"
                    pad="medium"
                  >
                    <Text>{language == "en" ? question.question : question.question_pl}</Text>
                    <CheckBox
                      label={language == "en" ? "Yes" : "Tak"}
                      checked={question.answer === true}
                      onChange={(e) =>
                        handleCheckBoxChange(survey, questionIndex, e.target.checked)
                      }
                    />
                    <CheckBox
                      label={language == "en" ? "No" : "Nie"}
                      checked={question.answer === false}
                      onChange={(e) =>
                        handleCheckBoxChange(survey, questionIndex, !e.target.checked)
                      }
                    />
                  </Card>
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
      <Footer3 />
    </Grommet>
  );
};

export default AnswearPage;



