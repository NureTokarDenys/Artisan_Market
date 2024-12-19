import { Link, useNavigate } from 'react-router-dom';
import { FaRegCircleUser, FaCartShopping, FaRegHeart, FaSuitcase, FaPlus, FaClipboardList } from "react-icons/fa6";
import MobileHeaderBars from './MobileHeaderBars';
import './Header.css';
import useAuth from '../hooks/useAuth';
import ProfileButton from './ProfileButton';


const Header = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate(`/catalog/add`);
}

  return (
    <header className="Header">
        <Link to="/products" className="textLogo">Artisan Market ©</Link>
        <ul className='linkList'>
            <li> <Link to="/products" title="Go to Products"> Shop </Link> </li>
            <li> <Link to="/about" title="Go to About"> About Us </Link> </li>
            <li> <Link to="/contact" title="Go to Contact"> Contact </Link> </li>
        </ul>
        <MobileHeaderBars className="mobile-header-bars" />
        <div className="search_profile">
            <Link to="/orders" title="Orders"> <FaClipboardList /> </Link> 

            {auth?.role === 'seller' && (
               <Link to="/catalog" title="Go to My Catalog"> <FaSuitcase /> </Link>
            )}

            <Link to="/wishlist" title="Go to Wishlist"> <FaRegHeart /> </Link>
            <Link to="/cart" title="Go to Cart"> <FaCartShopping /> </Link>
            <Link to="/profile" title="Go to Profile"> <FaRegCircleUser /> </Link>

              

            {auth?.role === 'seller' && (
               <ProfileButton action={handleAdd} className='upload-button-header' title='Add Product' bgColor='#84A98C' hoverColor='#0cad19' textColor='#' icon={<FaPlus color='white' size={20} />} />
            
            )}
        </div>
    </header>
  )
}

export default Header