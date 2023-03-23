import React, { useState } from "react";
import { Nav, Card, CheckBox } from "grommet";

const surveysData = [
  {
    id: 1,
    title: "Ankieta 1",
    description: "Krótki opis ankiety 1",
  },
  {
    id: 2,
    title: "Ankieta 2",
    description: "Krótki opis ankiety 2",
  },
];

function App() {
  const [searchText, setSearchText] = useState("");
  const [checkedSurveys, setCheckedSurveys] = useState([]);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleCheckbox = (surveyId) => {
    const newCheckedSurveys = [...checkedSurveys];
    const index = newCheckedSurveys.indexOf(surveyId);
    if (index > -1) {
      newCheckedSurveys.splice(index, 1);
    } else {
      newCheckedSurveys.push(surveyId);
    }
    setCheckedSurveys(newCheckedSurveys);
  };

  const filteredSurveys = surveysData.filter((survey) =>
    survey.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Nav direction="row" align="center" pad="medium">
        <img src="logo-holder.png" alt="Logo" />
      </Nav>
      <div style={{ padding: "20px" }}>
        <input type="text" value={searchText} onChange={handleSearch} />
        <Card background="light-1" pad="medium" margin={{ top: "20px" }}>
          {filteredSurveys.map((survey) => (
            <div key={survey.id}>
              <CheckBox
                checked={checkedSurveys.includes(survey.id)}
                onChange={() => handleCheckbox(survey.id)}
              />
              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                {survey.title}
              </span>
              <span style={{ marginLeft: "10px" }}>{survey.description}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

export default App;
