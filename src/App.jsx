import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FormPage from './components/FormPage';
import AdminPage from './components/AdminPage';
import ThankYou from './components/ThankYou';
import SubmissionDetail from './components/SubmissionDetail';
import LoginPage from './components/LoginPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('adminAuthenticated');
      setIsAuthenticated(adminAuth === 'true');
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/submission/:id" element={
          <ProtectedRoute>
            <SubmissionDetail />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;