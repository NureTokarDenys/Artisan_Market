import { Link } from 'react-router-dom';
import { FaCartShopping } from "react-icons/fa6";
import { FaRegCircleUser } from "react-icons/fa6";
import SearchBar from './SearchBar';
import './Header.css';

const Header = () => {
  return (
    <header className="Header">
        <p className="textLogo">Artisan Market ©</p>
        <ul className='linkList'>
            <li> <Link to="/products"> Shop </Link> </li>
            <li> <Link to="/about"> About Us </Link> </li>
            <li> <Link to="/contact"> Contact </Link> </li>
        </ul>
        <div className="search_profile">
            <Link to="/"> <SearchBar /> </Link> {/* TODO next sprints*/}
            <Link to="/profile"> <FaRegCircleUser /> </Link>
            <Link to="/cart"> <FaCartShopping /> </Link>  {/* TODO next sprints*/}
        </div>
    </header>
  )
}

export default Header