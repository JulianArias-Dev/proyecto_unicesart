import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/context';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/singin" />;
  }

  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default ProtectedRoute;
