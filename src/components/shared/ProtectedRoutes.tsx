import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (location.pathname === '/login') {
      // If user is already logged in, block access to login page
      if (token) {
        navigate('/');
      }
    } else {
      // For all other pages, require login
      if (!token) {
        navigate('/login');
      }
    }
  }, [navigate, location.pathname]);

  return <>{children}</>;
};

export default ProtectedRoutes;
