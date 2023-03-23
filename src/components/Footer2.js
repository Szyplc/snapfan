import React, { useState } from "react";
import { Grommet, Box, Button } from "grommet";
import EmailInputModal from "./EmailInputModal";

function Footer2({ selectedSurveys }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(null);

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
            label="Wyślij"
            className="orange-button"
            onClick={handleClick}
          />
        </Box>
      </Box>
      {showModal && (
        <EmailInputModal
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </Grommet>
  );
}

export default Footer2;
