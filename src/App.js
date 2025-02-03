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
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegistrationScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;