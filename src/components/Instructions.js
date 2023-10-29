import React, { useContext } from "react";
import { Grommet, Box, Button } from "grommet";
import { Link } from "react-router-dom";
import { LanguageContext } from "../LanguageProvider";

function Instructions({ handleSurveyInfoBarClose }) {
  const { translate } = useContext(LanguageContext);

  return (
    <Grommet>
         <div style={{ backgroundColor: "#f0f0f0", padding: "5px", fontSize: "25px", letterSpacing: "0.1px", lineHeight: "115%", position: "absolute", 
            bottom: "60px", top: "65px", left: "10px", right: "10px", textAlign: "center" }}>
            <div>{translate('welcomeMessage')}</div>
            <Box style={{ cursor: "pointer", display: "inline-block", border: "2px solid rgb(111, 255, 176)",
            borderRadius: "18px", padding: "4px 22px", marginTop: "10px", fontSize: "18px" }} className="orange-button" background="brand" 
            onClick={handleSurveyInfoBarClose}>{translate('closeInstructions')}</Box>
        </div>
        <Box
            as="footer"
            align="center"
            justify="center"
            background="brand"
            pad="medium"
            style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1 }}
        >
            <Box direction="row" justify="center" width="100%">
                <Button label={translate("closeInstructions")} onClick={handleSurveyInfoBarClose} className="orange-button" />
            </Box>
        </Box>
    </Grommet>
  );
}

export default Instructions;
