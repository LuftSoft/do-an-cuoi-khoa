import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import { AuthProvider } from './contexts/AuthProvider';
import { UserProvider } from './contexts/UserProvider';

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <AuthProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </AuthProvider>
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
