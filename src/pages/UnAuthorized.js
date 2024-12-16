import { Link, useLocation } from 'react-router-dom';
import './UnAuthorized.css';

const UnAuthorized = () => {
  const location = useLocation();
  const { currentRole, requiredRoles } = location.state || {};

  return (
    <div className="error-wrapper">
      <div className="error-container">
        <div className="error-code">401</div>
        <div className="error-message">Oops! You are not authorized to view this page</div>
        <p>
          The page you are trying to access is restricted. Here’s what you need to know:
        </p>
        <p>
          <strong>Your Role:</strong> {currentRole || 'None (Not logged in)'}
        </p>
        <p>
          <strong>Required Roles:</strong> {requiredRoles ? requiredRoles.join(', ') : 'None'}
        </p>
        <Link to="/products" className="return-link">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default UnAuthorized;
