import React from "react";
import { Grommet, Card, CardHeader, CheckBox } from "grommet";
import { useDispatch } from "react-redux";
import { addSelectedSurvey, removeSelectedSurvey } from "../store";
import { useSelector } from 'react-redux';

function SurveyCard(props) {
  const dispatch = useDispatch();
  const selectedSurveys = useSelector(state => state.selectedSurveys);

  const handleCheckBoxChange = (event) => {
    if (event.target.checked) {
      dispatch(addSelectedSurvey(props.survey));
    } else {
      dispatch(removeSelectedSurvey(props.survey));
    }
  };

  const isSelected = selectedSurveys.includes(props.survey);
  console.log(props)
  return (
    <Grommet>
      <label htmlFor={`checkbox-${props.survey._id}`}>
        <Card background="light-1" margin="medium">
          <CardHeader pad={{ horizontal: "medium", vertical: "small" }}>
            <CheckBox
              id={`checkbox-${props.survey._id}`}
              checked={isSelected}
              onChange={handleCheckBoxChange}
            />
            <h2 style={{ position: "absolute", display: "inline", margin: 0, left: 90 }}>
              {props.surveyName}
            </h2>
          </CardHeader>
        </Card>
      </label>
    </Grommet>
  );
}

export default SurveyCard;


// import React from "react";
// import { Grommet, Card, CardHeader, CheckBox } from "grommet";
// import { useDispatch } from "react-redux";
// import { addSelectedSurvey, removeSelectedSurvey } from "../store";
// import { useSelector } from 'react-redux';

// function SurveyCard(props) {
//   console.log(props)
//   const dispatch = useDispatch();
//   const selectedSurveys = useSelector(state => state.selectedSurveys);

//   const handleCheckBoxChange = (event) => {
//     if (event.target.checked) {
//       dispatch(addSelectedSurvey(props.survey));
//     } else {
//       dispatch(removeSelectedSurvey(props.survey));
//     }
//   };

//   const isSelected = selectedSurveys.includes(props.survey);

//   return (
//     <Grommet>
//       <Card background="light-1" margin="medium">
//         <CardHeader pad={{ horizontal: "medium", vertical: "small" }}>
//           <CheckBox
//             style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}
//             checked={isSelected}
//             onChange={handleCheckBoxChange}
//           />
//           <h2 style={{ position: "absolute", display: "inline", margin: 0, left: 90 }}>
//             {props.surveyName}
//           </h2>
//         </CardHeader>
//       </Card>
//     </Grommet>
//   );
// }


// export default SurveyCard;


