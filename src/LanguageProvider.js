import React, { useState } from 'react';
import en from './translations/en.json';
import pl from './translations/pl.json';

const translations = {
  en,
  pl,
};

const defaultLanguage = navigator.language.startsWith('pl') ? 'pl' : 'en';

const LanguageContext = React.createContext({
  language: defaultLanguage,
  setLanguage: () => {},
  translate: key => key,
});

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(defaultLanguage);

  const value = {
    language,
    setLanguage,
    translate: key => translations[language][key] || key,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageProvider, LanguageContext };


// import React, { useState } from 'react';
// import en from './translations/en.json';
// import pl from './translations/pl.json';

// const translations = {
//   en,
//   pl,
// };

// const LanguageContext = React.createContext({
//   language: 'pl',
//   setLanguage: () => {},
//   translate: key => key,
// });

// const LanguageProvider = ({ children }) => {
//   const [language, setLanguage] = useState('pl');

//   const value = {
//     language,
//     setLanguage,
//     translate: key => translations[language][key] || key,
//   };

//   return (
//     <LanguageContext.Provider value={value}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };




// export { LanguageProvider, LanguageContext };
