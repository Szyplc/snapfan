import React, { useState } from "react";
import { Grommet, Box, Button } from "grommet";
import AddReview from "./AddReview";
import { LanguageContext } from "../LanguageProvider";

function Footer3({  }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const { translate } = React.useContext(LanguageContext);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSubmit = (data) => {
    setFormData(data);
  };

  const handleClick = () => {
    setShowModal(true);
  };

  return (
    <Grommet>
      <Box
        as="footer"
        align="center"
        justify="center"
        background="brand"
        pad="medium"
        style={{ bottom: 0, left: 0, right: 0 }}
      >
        <Box direction="row" justify="center" width="100%">
                <Button
          label={translate("next")}
          className="orange-button"
          onClick={handleClick}
        />

        </Box>
      </Box>
      {showModal && (
        <AddReview
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </Grommet>
  );
}

export default Footer3;
