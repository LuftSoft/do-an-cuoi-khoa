import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Employees } from './pages';
import './App.css';
import Login from './pages/auth/login';

import { useStateContext } from './contexts/ContextProvider';
import Hotel from './pages/Hotels';
import { HotelProvider } from './contexts/HotelProvider';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const { currentMode } = useStateContext();
  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>

        <Routes>
          <Route path="/" element={(<PrivateRoute><Employees /></PrivateRoute>)} />
          {/* auth */}
          <Route path="/login" element={(<Login />)} />

          <Route path="/users" element={<PrivateRoute><Employees /></PrivateRoute>} />

          <Route path="/hotels" element={<HotelProvider><PrivateRoute> <Hotel /> </PrivateRoute></HotelProvider>} />

        </Routes>

      </BrowserRouter>
    </div>
  );
};

export default App;
