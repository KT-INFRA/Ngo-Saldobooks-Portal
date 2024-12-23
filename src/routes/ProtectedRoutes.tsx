import useAuth from 'hooks/useAuth';
import { Navigate, Outlet } from 'react-router';

function ProtectedRoutes() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to={'/login'} />;
}

export default ProtectedRoutes;
