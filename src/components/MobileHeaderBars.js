import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaListUl, FaXmark } from "react-icons/fa6";
import "./MobileHeaderBars.css"; 

const MobileHeaderBars = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isMenuOpen]);

  return (
    <>
      <FaListUl className="mobile-header-bars" onClick={toggleMenu} />
      <div 
        className={`overlay ${isMenuOpen ? 'open' : ''}`} 
        onClick={handleOutsideClick}
      >
        <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
          <FaXmark className="close-icon" onClick={toggleMenu} />
          <Link to="/products" className="text-Logo" onClick={toggleMenu}>
            Artisan Market ©
          </Link>
          <ul className="link-List">
            <li>
              <Link to="/products" onClick={toggleMenu}>Shop</Link>
            </li>
            <li>
              <Link to="/about" onClick={toggleMenu}>About Us</Link>
            </li>
            <li>
              <Link to="/contact" onClick={toggleMenu}>Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MobileHeaderBars;