import axios from 'axios';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const initialState = {
  surveys: [
    {id:1, name: "Survey 1" },
    {id:2, name: "Survey 2" },
    {id:3, name: "Survey 3" },
    {id:4, name: "Survey 4" },
    {id:5, name: "Survey 5" },
  ],
  selectedSurveys: [],
  questionPageSurveys: [],
  solvedSurveyByUserId: "", // dodany nowy klucz stanu
  //questionPageSurveystest: [], // dodany nowy klucz stanu

};

export const getSolvedSurveyByUserId = () => {
  return store.getState().solvedSurveyByUserId;
};

export const getSelectedSurveys = () => {
  return store.getState().selectedSurveys;
};

export const getQuestionPageSurveys = () => {
  return store.getState().questionPageSurveys;
};

export const addSelectedSurvey = (survey) => ({
  type: "ADD_SELECTED_SURVEY",
  payload: survey,
});

export const removeSelectedSurvey = (survey) => ({
  type: "REMOVE_SELECTED_SURVEY",
  payload: survey,
});

export const fetchSurveys = () => async (dispatch) => {
  try {
    //const response = await axios.get('https://snapfan.io:3001/surveys?title=true');
    const response = await axios.get("http://localhost:3001/surveys?title=true")
    const surveys = response.data;
    console.log(response)
    dispatch({ type: 'FETCH_SURVEYS_SUCCESS', payload: surveys });
  } catch (error) {
    console.log(error)
    dispatch({ type: 'FETCH_SURVEYS_FAILURE', payload: error.message });
  }
};

export const updateQuestionPageSurveys = (surveys) => ({
  type: "UPDATE_QUESTION_PAGE_SURVEYS",
  payload: surveys,
});

export const updateSolvedSurveyByUserId = (solvedSurveyByUserId) => ({
  type: "UPDATE_SOLVED_SURVEY_BY_USER_ID",
  payload: solvedSurveyByUserId,
});


export const fetchQuestionPageSurveys = () => async (dispatch, getState) => {
  const selectedSurveys = getState().selectedSurveys;
  console.log(selectedSurveys);
  const selectedSurveysIds = selectedSurveys.map(survey => survey._id);
  const link = `http://snapfan.io:3001/surveys/${selectedSurveysIds.join()}`;
  const response = await axios.get(link);
  const questionPageSurveys = response.data;
  dispatch({ type: 'FETCH_QUESTION_PAGE_SURVEYS_SUCCESS', payload: questionPageSurveys });
};

const surveysReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_SURVEYS_SUCCESS':
      return {
        ...state,
        surveys: action.payload,
      };
    case 'ADD_SURVEY':
      return {
        ...state,
        surveys: [...state.surveys, action.payload],
      };
    case 'ADD_SELECTED_SURVEY':
      return {
        ...state,
        selectedSurveys: [...state.selectedSurveys, action.payload],
      };
    case 'REMOVE_SELECTED_SURVEY':
      return {
        ...state,
        selectedSurveys: state.selectedSurveys.filter(
          (survey) => survey._id !== action.payload._id
        ),
      };
      case 'UPDATE_QUESTION_PAGE_SURVEYS':
        return {
          ...state,
          questionPageSurveys: action.payload,
        };
    case 'FETCH_QUESTION_PAGE_SURVEYS_SUCCESS': // dodany nowy case
      return {
        ...state,
        questionPageSurveys: action.payload,
      };
case 'UPDATE_SOLVED_SURVEY_BY_USER_ID':
  return {
    ...state,
    solvedSurveyByUserId: action.payload,
  }
case 'UPDATE_SOLVED_SURVEY_BY_USER_ID':
  return {
    ...state,
    solvedSurveyByUserId: action.payload,
  };
    default:
      return state;
  }
};

const store = createStore(surveysReducer, applyMiddleware(thunk));

export default store;
