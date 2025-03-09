import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;

// Usage example
// In your routing setup:
// <Routes>
//   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
// </Routes>
