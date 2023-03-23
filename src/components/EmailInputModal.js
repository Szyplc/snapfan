import React, { useState } from "react";
import { Box, Button, Form, FormField, Heading, Layer, TextInput, Text } from "grommet";
import { FormClose, Clipboard } from "grommet-icons";

const EmailInputModal = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [showLink, setShowLink] = useState(false);

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const handleSubmit = async () => {
    if (!emailRegex.test(email)) {
      alert("Podaj poprawny adres email. Nie będziemy mogli przesłać Ci wyników ankiety");
      return;
    }
    
    if (name.length < 3) {
      alert("Imię musi zawierać co najmniej 3 litery");
      return;
    }
    
    const response = await fetch("http://localhost:3001/generate-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, name })
    });
  
    const data = await response.json();
  
    setLink(data.link);
    setShowLink(true);
    console.log(data.link)
  };
  

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(link);
    alert("Link został skopiowany do schowka!");
  };

  return (
    <Layer onEsc={onClose} onClickOutside={onClose}>
      <Box pad="medium" gap="medium">
        <Box direction="row" justify="between">
          <Heading level="3">Podaj swoje dane otrzymasz na nie wasz wspólny wynik ankiety</Heading>
          <Button icon={<FormClose />} onClick={onClose} />
        </Box>
        <Form onSubmit={handleSubmit}>
          <FormField name="email" label="Email" >
            <TextInput type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </FormField>
          <FormField name="name" label="Imię" >
            <TextInput value={name} onChange={(event) => setName(event.target.value)} />
          </FormField>
          <Box direction="row" justify="end">
            <Button type="submit" label="Wygeneruj Link" primary />
          </Box>
        </Form>
        {showLink && (
            <Box direction="column" align="center" gap="small">
                <Text>Poniżej znajdziesz link do ankiety:</Text>
                <Box direction="row" align="center" gap="small">
                    <TextInput value={link} disabled />
                    <Button icon={<Clipboard />} onClick={handleCopyLink} />
                </Box>
            </Box>

        )}
      </Box>
    </Layer>
  );
};

export default EmailInputModal;
