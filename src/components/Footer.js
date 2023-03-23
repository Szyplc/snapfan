import React from "react";
import { Grommet, Box, Button } from "grommet";
import { Link } from "react-router-dom";


function Footer2({ selectedSurveys }) {
  const handleClick = () => {
    // send the selected surveys to the next page
  };

  console.log(selectedSurveys)
  return (
    <Grommet>
      <Box
        as="footer"
        align="center"
        justify="center"
        background="brand"
        pad="medium"
        style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1 }}
      >
        <Box direction="row" justify="center" width="100%">
          <Link
            to={{
              pathname: "/questions",
              state: { surveys: selectedSurveys },
            }}
          >
            <Button label="Rozwiąż" className="orange-button" onClick={handleClick} />
          </Link>
        </Box>
      </Box>
    </Grommet>
  );
}

export default Footer2;
