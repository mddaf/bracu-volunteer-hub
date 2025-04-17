import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';

const App = () => {
  const isLoggedIn = localStorage.getItem("user"); // simple login check

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={isLoggedIn ? <AccountPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
