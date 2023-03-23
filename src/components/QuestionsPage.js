import './QuestionsPage.css'; // importowanie pliku CSS
import NavigationBar2 from "./NavigationBar2";
import Footer2 from "./Footer2";
import React, { useEffect, useState } from "react";
import { Grommet, Heading, Box, Text, CheckBox, Card } from "grommet";
import axios from "axios";

const QuestionsPage = () => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/surveys").then((response) => {
      setSurveys(response.data);
    });
  }, []);

  const handleCheckBoxChange = (survey, questionIndex, checked) => {
    const updatedSurveys = [...surveys];
    updatedSurveys[surveys.indexOf(survey)].questions[questionIndex].answer = checked;
    setSurveys(updatedSurveys);
  };

  return (
    
    <Grommet>
      <NavigationBar2 />
      <Box pad="medium">
        {surveys.map((survey) => (
          <Box key={survey.id} margin={{ vertical: "medium" }}>
            <Heading level={3}>{survey.title}</Heading>
            {survey.questions.map((question, questionIndex) => {
              const cardClass = question.answer === true ? "answered-yes" : (question.answer === false ? "answered-no" : "");

              return (
                <Box key={questionIndex} margin={{ vertical: "small" }}>
                  <Card className={cardClass} background="light-1" pad="medium" margin={{ bottom: "small" }}>
                    <Text style={{ textAlign: "center" }}>{question.question}</Text>
                    <Box direction="row" justify="center" margin={{ right: "20px", left: "20px" }}>
                      <CheckBox
                        label="Tak"
                        checked={question.answer === true}
                        onChange={(event) => handleCheckBoxChange(survey, questionIndex, event.target.checked)}
                      />
                      <CheckBox
                        label="Nie"
                        checked={question.answer === false}
                        onChange={(event) => handleCheckBoxChange(survey, questionIndex, !event.target.checked)}
                      />
                    </Box>
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
