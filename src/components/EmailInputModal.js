import React, { useState } from "react";
import { Box, Button, Form, FormField, Heading, Layer, TextInput } from "grommet";
import { FormClose } from "grommet-icons";

const EmailInputModal = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = () => {
    onSubmit({ email, name });
    onClose();
  };

  return (
    <Layer onEsc={onClose} onClickOutside={onClose}>
      <Box pad="medium" gap="medium">
        <Box direction="row" justify="between">
          <Heading level="3">Podaj swoje dane na które otrzymasz wyniki ankiety</Heading>
          <Button icon={<FormClose />} onClick={onClose} />
        </Box>
        <Form onSubmit={handleSubmit}>
          <FormField name="email" label="Email" required>
            <TextInput type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </FormField>
          <FormField name="name" label="Imię" required>
            <TextInput value={name} onChange={(event) => setName(event.target.value)} />
          </FormField>
          <Box direction="row" justify="end">
            <Button type="submit" label="Wygeneruj Link" primary />
          </Box>
        </Form>
      </Box>
    </Layer>
  );
};

export default EmailInputModal;
