import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'semantic-ui-react';
import { FaRegHeart, FaHeart } from "react-icons/fa6";

import './ProductCard.css';

const ProductCard = ({ product, wishlist, setWishlist }) => {
  const isInWishlist = wishlist.length == 0 ? false : wishlist.some((item) => item._id === product._id);

  
  const toggleWishlist = () => {
    if (isInWishlist) {
      setWishlist(wishlist.filter((item) => item._id !== product._id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-link">
        <Image
          src={product.images[0]}
          alt={product.name}
          className="product-image"
        />
        <div className="product-info">
          <h2 className="product-name">{product.name}</h2>
          <p className="product-price">${product.price.toFixed(2)}</p>
        </div>
      </Link>

      <div className="wishlist-icon" onClick={toggleWishlist}>
        {isInWishlist ? (
          <FaHeart className="heart-icon filled" />
        ) : (
          <FaRegHeart className="heart-icon outline" />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
