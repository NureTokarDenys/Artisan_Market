import './Loader.css';

const Loader = ({ size = 'md', color = 'green', text = '' }) => {
  const sizeClasses = {
    sm: 'loader-sm',
    md: 'loader-md',
    lg: 'loader-lg'
  };

  const colorClasses = {
    blue: 'loader-blue',
    green: 'loader-green',
    red: 'loader-red',
    purple: 'loader-purple'
  };

  return (
    <div className="loader-container">
      <div className={`
        loader 
        ${sizeClasses[size]} 
        ${colorClasses[color]}
      `}></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

const LoadingOverlay = ({ isLoading, children, text }) => {
  if (!isLoading) return children;

  return (
    <div className="loading-overlay">
      {children}
      <div className="loading-overlay-content">
        <Loader size="lg" color="blue" text={text} />
      </div>
    </div>
  );
};

export { Loader, LoadingOverlay };