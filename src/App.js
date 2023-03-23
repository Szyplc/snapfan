
import React, { useState } from "react";
import NavigationBar from "./components/NavigationBar";
import SurveyCard from "./components/SurveyCard";
import Footer2 from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuestionsPage from "./components/QuestionsPage";
import { Provider, useSelector } from "react-redux";
import store from "./store";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const surveys = useSelector((state) => state.surveys);
  const filteredSurveys = surveys.filter((survey) =>
    survey.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/questions" element={<QuestionsPage />} />
          <Route
            path="/"
            element={
              <div style={{ paddingTop: "40px", paddingBottom: "70px" }}>
                <NavigationBar handleSearchChange={handleSearchChange} />
               
                {filteredSurveys.map((survey) => (
                  
                  <SurveyCard key={survey.name} surveyName={survey.name} surveyId={survey.id} survey = {survey} />
                ))}
                <Footer2 selectedSurveys={filteredSurveys} />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;



