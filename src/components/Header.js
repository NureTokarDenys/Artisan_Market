import { Link } from 'react-router-dom';
import { FaRegCircleUser, FaCartShopping, FaRegHeart } from "react-icons/fa6";
import SearchBar from './SearchBar';
import MobileHeaderBars from './MobileHeaderBars';
import './Header.css';


const Header = () => {
  return (
    <header className="Header">
        <Link to="/products" className="textLogo">Artisan Market ©</Link>
        <ul className='linkList'>
            <li> <Link to="/products"> Shop </Link> </li>
            <li> <Link to="/about"> About Us </Link> </li>
            <li> <Link to="/contact"> Contact </Link> </li>
        </ul>
        <MobileHeaderBars className="mobile-header-bars" />
        <div className="search_profile">
            <Link to="/"> <SearchBar /> </Link> {/* TODO*/}
            <Link to="/wishlist"> <FaRegHeart /> </Link> 
            <Link to="/profile"> <FaRegCircleUser /> </Link>
            <Link to="/cart"> <FaCartShopping /> </Link>  {/* TODO*/}
        </div>
    </header>
  )
}

export default Header