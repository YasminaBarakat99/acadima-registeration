import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginScreen from './Screens/LoginScreen';
import RegistrationScreen from './Screens/RegistrationScreen';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect from '/' to '/login' */}
          <Route path="/" element={<Navigate to="/react/login" replace />} />
          <Route path="/react/login" element={<LoginScreen />} />
          <Route path="/react/register" element={<RegistrationScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;