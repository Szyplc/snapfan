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

  const handleCheckBoxChange = (surveyIndex, questionIndex, checked) => {
    const updatedSurveys = [...surveys];
    updatedSurveys[surveyIndex].questions[questionIndex].answer = checked;
    setSurveys(updatedSurveys);
  };

  return (
    <Grommet>
      <NavigationBar2></NavigationBar2>
      <Box pad="medium">
        {surveys.map((survey, surveyIndex) => (
          <Box key={survey._id} margin={{ vertical: "medium" }}>
            <Heading level={3}>{survey.title}</Heading>
            {survey.questions.map((question, questionIndex) => (
              <Box key={questionIndex} margin={{ vertical: "small" }}>
                <Card background="light-1" pad="medium" margin={{bottom: "small"}}>
                  <Text>{question}</Text>
                  <Box direction="row" justify="center">
                    <CheckBox
                      label="Tak"
                      checked={question.answer === true}
                      onChange={(event) =>
                        handleCheckBoxChange(surveyIndex, questionIndex, event.target.checked)
                      }
                    />
                    <CheckBox
                      label="Nie"
                      checked={question.answer === false}
                      onChange={(event) =>
                        handleCheckBoxChange(surveyIndex, questionIndex, !event.target.checked)
                      }
                    />
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
      <Footer2></Footer2>
    </Grommet>
  );
};

export default QuestionsPage;


// import React, { useEffect, useState } from "react";
// import { Grommet, Heading, Box, Text, CheckBox } from "grommet";
// import axios from "axios";

// const QuestionsPage = () => {
//   const [surveys, setSurveys] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:3001/surveys").then((response) => {
//       setSurveys(response.data);
//     });
//   }, []);

//   const handleCheckBoxChange = (surveyIndex, questionIndex, isChecked) => {
//     setSurveys((prevSurveys) => {
//       const updatedSurveys = [...prevSurveys];
//       updatedSurveys[surveyIndex].questions[questionIndex].answer = isChecked;
//       return updatedSurveys;
//     });
//   };

//   return (
//     <Grommet>
//       <Box pad="medium">
//         <Heading level={2}>Ankiety</Heading>
//         {surveys.map((survey, surveyIndex) => (
//           <Box key={survey._id} margin={{ vertical: "medium" }}>
//             <Heading level={3}>{survey.title}</Heading>
//             {survey.questions.map((question, questionIndex) => (
//               <Box key={questionIndex} margin={{ vertical: "small" }}>
//                 <Text>{question}</Text>
//                 <CheckBox
//                   label="Tak"
//                   checked={question.answer === true}
//                   onChange={(event) =>
//                     handleCheckBoxChange(surveyIndex, questionIndex, event.target.checked)
//                   }
//                 />
//                 <CheckBox
//                   label="Nie"
//                   checked={question.answer === false}
//                   onChange={(event) =>
//                     handleCheckBoxChange(surveyIndex, questionIndex, !event.target.checked)
//                   }
//                 />
//               </Box>
//             ))}
//           </Box>
//         ))}
//       </Box>
//     </Grommet>
//   );
// };

// export default QuestionsPage;
