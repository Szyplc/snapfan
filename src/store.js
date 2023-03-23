import { createStore } from "redux";

const initialState = {
  surveys: [
    {id:1, name: "Survey 1" },
    {id:2, name: "Survey 2" },
    {id:3, name: "Survey 3" },
    {id:4, name: "Survey 4" },
    {id:5, name: "Survey 5" },
  ],
  selectedSurveys: [],
};

export const addSelectedSurvey = (survey) => ({
  type: "ADD_SELECTED_SURVEY",
  payload: survey,
});

export const removeSelectedSurvey = (surveyId) => ({
  type: "REMOVE_SELECTED_SURVEY",
  payload: surveyId,
});

const surveysReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_SURVEY":
      return {
        ...state,
        surveys: [...state.surveys, action.payload],
      };
    case "ADD_SELECTED_SURVEY":
      return {
        ...state,
        selectedSurveys: [...state.selectedSurveys, action.payload],
      };
      case "REMOVE_SELECTED_SURVEY":
        return {
          ...state,
          selectedSurveys: state.selectedSurveys.filter(
            (survey) => survey.id !== action.payload
          ),
        };
    default:
      return state;
  }
};

const store = createStore(surveysReducer);

export default store;
