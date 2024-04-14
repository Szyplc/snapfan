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

const EmailInputModal = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [showLink, setShowLink] = useState(false);
  const [showText, setShowText] = useState(false);

  const [visible, setVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("");
  const { translate, language } = useContext(LanguageContext);
  const [isLoading, setIsLoading] = useState(false); // add isLoading state variable

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const responses = getQuestionPageSurveys();
  console.log(responses);

  const solvedSurveyByUserId = getSolvedSurveyByUserId();

  const handleSubmit = async () => {
    if (!emailRegex.test(email)) {
      setNotificationMessage(translate("email_invalid"));
      setNotificationStatus("error");
      setVisible(true);
      return;
    }

    if (name.length < 3) {
      setNotificationMessage(translate("name_invalid"));
      setNotificationStatus("error");
      setVisible(true);
      return;
    }
    setIsLoading(true); // set isLoading to true

    let response;
    console.log(JSON.stringify({ email, name, responses, solvedSurveyByUserId, language }))
    if (solvedSurveyByUserId) {
      response = await fetch(
        "http://127.0.0.1:3001/compare-survey-answers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, name, responses, solvedSurveyByUserId, language }),
        }
      );
    } else {
      response = await fetch("http://127.0.0.1:3001/generate-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, responses, solvedSurveyByUserId }),
      });
    }

    setIsLoading(false); // set isLoading to false when the response is received


    console.log(JSON.stringify({ email, name, responses, solvedSurveyByUserId }));

    const data = await response.json();

    if (response.status === 200 && solvedSurveyByUserId) {
      setNotificationMessage(translate("email_sent"));
      setNotificationStatus("success");
      setVisible(true);
    } else {
      setLink(data.link);
      setShowLink(true);
      console.log(data.link);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(link);
    setNotificationMessage(translate("link_copied"));
    setNotificationStatus("success");
    setVisible(true);
    setShowText(true);

  };

  return (
    <Layer onEsc={onClose} onClickOutside={onClose}>
      <Box pad="medium" gap="medium">
        <Box direction="row" justify="between">
          <Heading level="3">
            {solvedSurveyByUserId? translate("provide_details_to_receive_email"):translate("provide_details_to_receive_link")}
          </Heading>
          <Button icon={<FormClose />} onClick={onClose} />
        </Box>
        {visible && (
      <Notification
        toast
       // title={notificationStatus}
        message= {notificationMessage}
        onClose={() => setVisible(false)}
      />
    )}
        <Form onSubmit={handleSubmit}>
          <FormField name="email" label={translate("email")}>
            <TextInput
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </FormField>

          <FormField name="name" label={translate("name")}>
            <TextInput
              value={name}
             

              onChange={(event) => setName(event.target.value)}
            />
          </FormField>
          <Button type="submit" disabled={isLoading} label={solvedSurveyByUserId ? translate("send_email") : translate("generate_link")}  primary />        </Form>
        {showLink && (
          <Box direction="column" align="center" gap="small">
            <Text>{translate("survey_link_below")}</Text>
            <Box direction="row" align="center" gap="small" onClick={handleCopyLink} >
              <TextInput value={link} disabled   />
              <Button icon={<Clipboard />} />
            </Box>
            {showText &&(
            <Text style={{color: 'red'}}>{translate("check_spam")}</Text>
            )}
            </Box>
        )}
      </Box>
    </Layer>
  );
  
      }

export default EmailInputModal;




// import React, { useState } from "react";
// import { Box, Button, Form, FormField, Heading, Layer, TextInput, Text } from "grommet";
// import { FormClose, Clipboard } from "grommet-icons";
// import {getQuestionPageSurveys, getSolvedSurveyByUserId} from  "../store"
// import { LanguageContext } from "../LanguageProvider";


// const EmailInputModal = ({ onClose, onSubmit }) => {
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [link, setLink] = useState("");
//   const [showLink, setShowLink] = useState(false);
//   const { translate } = React.useContext(LanguageContext);

//   const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;



    
//   const responses = getQuestionPageSurveys();
//   console.log(responses);
//   const solvedSurveyByUserId = getSolvedSurveyByUserId();

//   const handleSubmit = async () => {
//     if (!emailRegex.test(email)) {
//       alert(translate("email_invalid"));
//       return;
//     }
    
//     if (name.length < 3) {
//       alert(translate("name_invalid"));
//       return;
//     }

//   let response;
//   if (solvedSurveyByUserId) {
//     response = await fetch("http://127.0.0.1:3001/compare-survey-answers", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, name, responses, solvedSurveyByUserId }),
//     });
//   } else {
//     response = await fetch("http://127.0.0.1:3001/generate-link", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, name, responses, solvedSurveyByUserId }),
//     });
//   }

//   console.log(JSON.stringify({ email, name, responses, solvedSurveyByUserId }));

//   const data = await response.json();

//   if (response.status === 200 && solvedSurveyByUserId) {
//     alert(translate("email_sent"));
//   } else {
//     setLink(data.link);
//     setShowLink(true);
//     console.log(data.link);
//   }
// };

// const handleCopyLink = async () => {
//   await navigator.clipboard.writeText(link);
//   alert(translate("link_copied"));
// };

// return (
//   <Layer onEsc={onClose} onClickOutside={onClose}>
//     <Box pad="medium" gap="medium">
//       <Box direction="row" justify="between">
//         <Heading level="3">{translate("provide_details_to_receive_link")}</Heading>
//         <Button icon={<FormClose />} onClick={onClose} />
//       </Box>
//       <Form onSubmit={handleSubmit}>
//         <FormField name="email" label={translate("email")}>
//           <TextInput type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
//         </FormField>
//         <FormField name="name" label={translate("name")}>
//           <TextInput value={name} onChange={(event) => setName(event.target.value)} />
//         </FormField>
//         <Box direction="row" justify="end">
//           <Button type="submit" label={solvedSurveyByUserId ? translate("send_email") : translate("generate_link")}  primary />
//         </Box>
//       </Form>
//       {showLink && (
//         <Box direction="column" align="center" gap="small">
//           <Text>{translate("survey_link_below")}</Text>
//           <Box direction="row" align="center" gap="small" onClick={handleCopyLink}>
//             <TextInput value={link} disabled   />
//             <Button icon={<Clipboard />} />
//           </Box>
//         </Box>
//       )}
//     </Box>
//   </Layer>
// );
//       }

// export default EmailInputModal;


