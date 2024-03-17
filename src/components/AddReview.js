import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Form,
  FormField,
  Heading,
  Layer,
  TextInput,
  Text,
} from "grommet";
import { FormClose, Clipboard } from "grommet-icons";
import { getQuestionPageSurveys, getSolvedSurveyByUserId } from "../store";
import { LanguageContext } from "../LanguageProvider";
import { Notification } from "grommet";

const AddReview = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [what_do_you_like, setWhat_do_you_like] = useState("");
  const [what_you_dont_like, setWhat_you_dont_like] = useState("");
  const [what_would_you_add, setWhat_would_you_add] = useState("");

  const [showEmailInput, setShowEmailInput ] = useState(false);

  const [visible, setVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("");
  const { translate } = useContext(LanguageContext);
  const [isLoading, setIsLoading] = useState(false); // add isLoading state variable
  const [value, setValue] = useState('');

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const responses = getQuestionPageSurveys();
  console.log(responses);

  const solvedSurveyByUserId = getSolvedSurveyByUserId();

  const handleChange = event => {
    setValue(event.target.value);
    setShowEmailInput(true);

  };

  const handleSubmit = async () => {
    setIsLoading(true); // set isLoading to true
    const formValues = {
      email,
      name,
      what_do_you_like,
      what_you_dont_like,
      what_would_you_add,
      do_you_want_dating_app: value,
      leave_your_email_if_you_want_to_stay_in_touch: showEmailInput ? email : null,
    };
    console.log(JSON.stringify(formValues))
    try {
        //        "http://145.239.93.11:3001/review",

      const response = await fetch(
        "http://145.239.93.11:3001/review",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );
      setIsLoading(false); // set isLoading to false when the response is received
      const data = await response.json();
        setNotificationMessage(translate("feedback_sent"));
        setNotificationStatus("success");
        setVisible(true);
       
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <Layer onEsc={onClose} onClickOutside={onClose}>
      <Box pad="medium" gap="medium">
        <Box direction="row" justify="between">
          <Heading level="3">
            {translate("add_review")}
          </Heading>
          <Button icon={<FormClose />} onClick={onClose} />
        </Box>
        {visible && (
      <Notification
        toast
        title={notificationStatus}
        message= {notificationMessage}
        onClose={() => setVisible(false)}
      />
    )}
        <Form onSubmit={handleSubmit}>
          <FormField name="what_do_you_like" label={translate("what_do_you_like")}>
            <TextInput
              type="text"
              value={what_do_you_like}
              onChange={(event) => setWhat_do_you_like(event.target.value)}
            />
          </FormField>
          <FormField name="what_you_dont_like" label={translate("what_you_dont_like")}>
            <TextInput
              type="text"
              value={what_you_dont_like}
              onChange={(event) => setWhat_you_dont_like(event.target.value)}
            />
          </FormField>
          <FormField name="what_would_you_add" label={translate("what_would_you_add")}>
            <TextInput
              type="text"
              value={what_would_you_add}
              onChange={(event) => setWhat_would_you_add(event.target.value)}
            />
          </FormField>
          <FormField name="do_you_want_dating_app" label={translate("do_you_want_dating_app_like_that")}>
                    <div align="center">
                <label>
                    <input
                    type="radio"
                    value="yes"
                    checked={value === "yes"}
                    onChange={handleChange}
                    />
                    Yes
                </label>
                <label>
                    <input
                    type="radio"
                    value="no"
                    checked={value === "no"}
                    onChange={handleChange}
                    />
                    No
                </label>
                </div>
          </FormField>
          {showEmailInput && (<FormField name="leave_your_email_if_you_want_to_stay_in_touch" label={translate("leave_your_email_if_you_want_to_stay_in_touch")}>
            <TextInput
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </FormField>
          )} 
          <Button type="submit" disabled={isLoading} label={translate("Send_Review")}  primary />        
          </Form>
      </Box>
    </Layer>
  );
  
      }

export default AddReview;