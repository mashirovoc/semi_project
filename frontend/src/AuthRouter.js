import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/common/useAuth';
export const PrivateRoute = ({ children }) => {
  const check = useAuth();
  if (!check.checked) {
    return <div>Loading...</div>;
  }
  if (check.isAuthenticated) {
    return children;
  }
  return <Navigate to='/' />;
};
export const GuestRoute = ({ children }) => {
  const check = useAuth();
  if (!check.checked) {
    return <div>Loading...</div>;
  }
  if (check.isAuthenticated) {
    return <Navigate to='/home' />;
  }
  return children;
};