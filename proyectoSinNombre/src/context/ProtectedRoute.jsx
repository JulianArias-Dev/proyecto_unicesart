import { Navigate } from 'react-router-dom';
import { useAuth} from '../context/AuthContext.jsx';

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/singin" />;
  }

  return element;
};

export default ProtectedRoute;
