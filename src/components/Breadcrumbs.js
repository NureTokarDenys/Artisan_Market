import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = ({ links = [] }) => {
  return (
    <div className="breadcrumbs-navigation">
      {links.map((breadcrumb, index) => (
        <span key={index}>
          {index < links.length - 1 ? (
            <>
              <Link to={breadcrumb.link}>{breadcrumb.name}</Link>
              <span> / </span>
            </>
          ) : (
            <span>{breadcrumb.name}</span>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
