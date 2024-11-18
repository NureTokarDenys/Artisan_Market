import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className='error-wrapper'>
      <div class="error-container">
          <div class="error-code">404</div>
          <div class="error-message">Oops! Page Not Found</div>
          <p>The page you are looking for is nonexistent or might have been removed, had its name changed, or is temporarily unavailable.</p>
          <Link to="/products" class="return-link">Return to Homepage</Link>
      </div>
    </div>
  )
}

export default NotFound