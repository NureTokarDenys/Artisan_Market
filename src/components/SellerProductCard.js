import { useState } from 'react';
import { Image } from 'semantic-ui-react';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import './SellerProductCard.css';
import ProfileButton from './ProfileButton';

const SellerProductCard = ({ product }) => {
    const imagesLength = product.images.length;
    const [activeImage, setActiveImage] = useState(0);
    const handleRightArrowClick = () => {
        if (imagesLength === 1) {
            return;
        }
        if (activeImage + 1 < imagesLength){
            setActiveImage(activeImage + 1);
        }
    }

    const handleLeftArrowClick = () => {
        if (imagesLength === 1) {
            return;
        }
        if (activeImage - 1 >= 0){
            setActiveImage(activeImage - 1);
        }
    }

  return (
    <div className="seller-product-card">
        <div className='seller-product-card-image-wrapper'>
            <FaAngleLeft size={25} onClick={handleLeftArrowClick} opacity={activeImage - 1 < 0 ? 0.3 : 1} />
            <Image src={product.images[activeImage]} alt={product.name} className="seller-product-image" />
            <FaAngleRight size={25} onClick={handleRightArrowClick} opacity={activeImage + 1 >= imagesLength ? 0.3 : 1} />
        </div>
        <div className="seller-product-info">
          <h2 className="seller-product-name">Product: {product.name}</h2>
          <h2 className="seller-product-price">Price: ${product.price.toFixed(2)}</h2>
          <h2 className="seller-product-stock">Stock: {product.quantity} pcs</h2>
          <h2 className="seller-product-status">Status: <p className={product.status}>{product.status}</p></h2>
        </div>
        <div className='seller-product-actions'>
            <ProfileButton title='Edit' border='1px solid #84A98C' textColor='#84A98C' bgColor='#ffffff' hoverColor='#3acf46' hoverTextColor='#000000' />
            <ProfileButton title='Hide' border='1px solid #84A98C' textColor='#84A98C' bgColor='#ffffff' hoverColor='#3acf46' hoverTextColor='#000000' />
            <ProfileButton title='Delete' border='1px solid #EB001A' textColor='#EB001A' bgColor='#ffffff' hoverColor='#EB001A' hoverTextColor='#000000' />
        </div>
    </div>
  );
};

export default SellerProductCard;
