import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { StoreProvider } from 'easy-peasy'
import store from './store';

import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <StoreProvider store={store}>
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  </StoreProvider>,
  document.getElementById('root')
);
