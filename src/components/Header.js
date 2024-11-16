import { Link } from 'react-router-dom';
import { CgShoppingCart } from 'react-icons/cg';
import { CgProfile } from 'react-icons/cg';
import SearchBar from './SearchBar';
import './Header.css';

const Header = () => {
  return (
    <header className="Header">
        <p className="textLogo">Artisan Market ©</p>
        <ul className='linkList'>
            <li> <Link to="/"> Shop </Link> </li>
            <li> <Link to="/about"> About Us </Link> </li>
            <li> <Link to="/contact"> Contact </Link> </li>
        </ul>
        <div className="search_profile">
            <Link to="/"> <SearchBar /> </Link> {/* TODO */}
            <Link to="/profile"> <CgProfile /> </Link>
            <Link to="/cart"> <CgShoppingCart /> </Link>
        </div>
    </header>
  )
}

export default Header