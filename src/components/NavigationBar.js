import React, { useState } from "react";
import { Grommet, Box, Header, Anchor, Nav, TextInput, Select } from "grommet";
import { FormSearch } from "grommet-icons";
import { LanguageContext } from "../LanguageProvider";
import { useNavigate } from "react-router-dom";


function NavigationBar({ handleSearchChange }) {
  const languageOptions = ["EN", "PL"];
  const { language, setLanguage, translate } = React.useContext(LanguageContext);
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    setLanguage(event.target.value.toLowerCase());
  };
  
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/")
  }

  return (
    <Grommet>
      <Box
        as="header"
        background="brand"
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1 }}
      >
        <Header>
          <Nav>
            <Anchor onClick={goHome}color="white" size="large" weight="bold" style={{ marginLeft: "5px" }}>
              <img src="/logop.png" alt="logo" />
            </Anchor>  
          </Nav>
          <Box direction="row" justify="end" gap="medium" align="center">
            {/* <FormSearch color="white" size="large" /> */}
            <TextInput
              type="search"
              placeholder={language == "en" ? "Search" : "Szukaj"}
              onChange={handleSearchChange}
              color="white"
            />
          </Box>
          <Box style={{ width:90 }}>
            <Select
              options={languageOptions}
              value={selectedLanguage.toUpperCase()}
              onChange={handleLanguageChange}
            />
          </Box>
        </Header>
      </Box>
    </Grommet>
  );
}


export default NavigationBar;

{/* 

import React from "react";
import { Grommet, Box, Header, Anchor, Nav, TextInput, Select } from "grommet";
import { FormSearch } from "grommet-icons";

function NavigationBar({ handleSearchChange }) {
  const languageOptions = ["PL", "En"];
  const [selectedLanguage, setSelectedLanguage] = React.useState(languageOptions[0]);

  return (
    <Grommet>
      <Box
        as="header"
        background="brand"
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1, justifyContent: "space-between" }}
        direction="row"
        align="center"
        justify="between"
        pad={{ vertical: "medium", horizontal: "medium" }}
      >
        <Anchor href="/" color="white" size="large" weight="bold" style={{ marginLeft: "5px" }}>
          <img src="/logop.png" alt="logo" />
        </Anchor>

          <Box direction="row" justify="center" gap="medium" align="center">
            <FormSearch color="white" size="large" />
            <TextInput type="search" placeholder="Search" onChange={handleSearchChange} />
          </Box>
          <Box direction="row" align="center">
          <Box margin={{ right: "medium" }}>
            <Select
              options={languageOptions}
              value={selectedLanguage}
              onChange={({ option }) => setSelectedLanguage(option)}
            />
          </Box>
        </Box>
      </Box>
    </Grommet>
  );
}

export default NavigationBar; */}
