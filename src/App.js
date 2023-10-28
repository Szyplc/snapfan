import React, { useState } from "react";
import NavigationBar from "./components/NavigationBar";
import SurveyCard from "./components/SurveyCard";
import Footer from "./components/Footer";
import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import QuestionsPage from "./components/QuestionsPage";
import AnswearPage from "./components/AnswearsPage";
import MoreInformations from "./components/MoreInformations";

import { Provider, useSelector } from "react-redux";
import store from "./store";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSurveys } from './store';
import { LanguageContext } from "./LanguageProvider";
import { LanguageProvider } from "./LanguageProvider";

function App() {
  const dispatch = useDispatch();
  const { language, setLanguage, translate } = React.useContext(LanguageContext);

  useEffect(() => {
    dispatch(fetchSurveys());
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSurveyInfoBarVisible, setIsSurveyInfoBarVisible] = useState(true);

  const surveys = useSelector((state) => state.surveys);
  const filteredSurveys = surveys.filter((survey) => {
    const title = survey.title;
    return title && title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSurveyInfoBarClose = () => {
    setIsSurveyInfoBarVisible(false);
  };
  useEffect(() => {console.log(LanguageContext.language)}, [])
  useEffect(() => {console.log(LanguageProvider.language)}, [])
  useEffect(() => {console.log(language)}, [language])

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/moreinformations" element={<MoreInformations />} />

          <Route path="/questions/:solvedsurveybyusersId" element={<QuestionsPage />} />
          <Route path="/answears" element={<AnswearPage />} />
          <Route path="/answears/:surveyresults" element={<AnswearPage />} />
          <Route
            path="/"
            element={
              <div style={{ paddingTop: "40px", paddingBottom: "70px" }}>
                {isSurveyInfoBarVisible && (
                  <div style={{ backgroundColor: "#f0f0f0", padding: "10px", display: "flex", justifyContent: "space-between" }}>
                    <div>{translate('welcomeMessage')}</div>
                    <div style={{ cursor: "pointer", color: "blue" }} onClick={handleSurveyInfoBarClose}>{translate('closeInstructions')}</div>
                  </div>
                )}
                <NavigationBar handleSearchChange={handleSearchChange} />
                {filteredSurveys.map((survey) => (
                  <SurveyCard key={survey._id} surveyName={language=="en" ? survey.title : survey.title_pl} surveyId={survey._id} survey={survey} />
                ))}
                <Footer selectedSurveys={filteredSurveys} />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default function WrappedApp() {
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
}



//export default App;



// import React, { useState } from "react";
// import NavigationBar from "./components/NavigationBar";
// import SurveyCard from "./components/SurveyCard";
// import Footer2 from "./components/Footer";
// import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
// import QuestionsPage from "./components/QuestionsPage";
// import AnswearPage from "./components/AnswearsPage";

// import { Provider, useSelector } from "react-redux";
// import store from "./store";
// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { fetchSurveys } from './store';
// import { LanguageContext } from "./LanguageProvider";

// function App() {
//   const dispatch = useDispatch();
  
//   useEffect(() => {
//     dispatch(fetchSurveys());
//   }, [dispatch]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSurveyInfoBarVisible, setIsSurveyInfoBarVisible] = useState(true); // Dodany stan

//   const surveys = useSelector((state) => state.surveys);
//   const filteredSurveys = surveys.filter((survey) => {
//     const title = survey.title;
//     return title && title.toLowerCase().includes(searchQuery.toLowerCase());
//   });

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const handleSurveyInfoBarClose = () => { // Funkcja do zamknięcia paska informacyjnego
//     setIsSurveyInfoBarVisible(false);
//   }

//   const { language, translate } = useContext(LanguageContext);

//   return (
//     <Provider store={store}>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/questions" element={<QuestionsPage />} />
//           <Route path="/questions/:solvedsurveybyusersId" element={<QuestionsPage />} />

//           <Route path="/answears" element={<AnswearPage />} />
//           <Route path="/answears/:surveyresults" element={<AnswearPage />} />
//           <Route
//             path="/"
//             element={
//               <div style={{ paddingTop: "40px", paddingBottom: "70px" }}>
//                 {isSurveyInfoBarVisible && ( // Dodanie paska informacyjnego tylko gdy isSurveyInfoBarVisible jest true
//                   <div style={{ backgroundColor: "#f0f0f0", padding: "10px", display: "flex", justifyContent: "space-between" }}>
//                     <div>Witaj na stronie z SNAPFUN.IO z Ankietami chcesz poznać łączące was kwestie. 
//                       Wybierz które ankiety chcesz rozwiązać zaznaczając je.
//                       Następnie rozwiąż ankietę.
//                       Na końcu otrzymasz link po wysłaniu którego do twojego partnera/potencjalnej drugiej połówki oraz wypełnieniu przez nią wybranych wcześniej przez ciebie ankiet
//                       Obaje otrzymacie maile z MATCHUJACYMI się odpowiedziami (TYLKO TAK) wszystkie odpowiedzi gdzie się nie zgadzacie oraz wspólne odpowiedzi na NIE zostaną pominięte. 
//                     </div>
//                     <div style={{ cursor: "pointer", color:"blue"}} onClick={handleSurveyInfoBarClose}>Zamknij Instrukcję</div>
//                   </div>
//                 )}
//                 <NavigationBar handleSearchChange={handleSearchChange} />
//                 {filteredSurveys.map((survey) => (
//                   <SurveyCard key={survey._id} surveyName={survey.title} surveyId={survey._id} survey={survey} />
//                 ))}
//                 <Footer2 selectedSurveys={filteredSurveys} />
//               </div>
//             }
//           />
//         </Routes>
//       </BrowserRouter>
//     </Provider>
//   );
// }

// export default App;
