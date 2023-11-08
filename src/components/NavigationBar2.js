import React, { useState } from "react";
import { Grommet, Box, Header, Anchor, Nav, TextInput, Select } from "grommet";
import { FormSearch } from "grommet-icons";
import { LanguageContext } from "../LanguageProvider";
import { useNavigate } from "react-router-dom";


function NavigationBar2({ handleSearchChange }) {
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
            <Anchor onClick={goHome} color="white" size="large" weight="bold" style={{ marginLeft: "5px" }}>
              <img src="/logop3.png" alt="logo" />
            </Anchor>  
          </Nav>
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


export default NavigationBar2;



// import React from "react";
// import { Grommet, Box, Header, Anchor, Nav,  } from "grommet";
// function NavigationBar2() {
//   return (
//     <Grommet>
//       <Box
//         as="header"
//         background="brand"
//         style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1 }}
//       >
//         <Header>
//           <Nav>
//             <Anchor href="/" color="white" size="large" weight="bold">
//             <img src="./logop.png" alt="logo"/>

//               {/* <Logo height="40px" /> */}
//             </Anchor>
//           </Nav>
//         </Header>
//       </Box>
//     </Grommet>
//   );
// }

// export default NavigationBar2;
