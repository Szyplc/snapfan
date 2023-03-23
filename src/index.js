import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals



// reportWebVitals();

// import React from 'react';
// import ReactDOM from 'react-dom';
// import { createStore } from 'redux'; //importujemy createStore z Redux
// import { Provider } from 'react-redux'; //importujemy Provider z react-redux
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import rootReducer from './reducers'; //importujemy główny reducer aplikacji

// const store = createStore(rootReducer); //tworzymy store na podstawie głównego reducera

// ReactDOM.render(
// <Provider store={store}> {/* owijamy komponent App w Provider i przekazujemy mu store */}
// <React.StrictMode>
// <App />
// </React.StrictMode>
// </Provider>,
// document.getElementById('root')
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// reportWebVitals();
