import { Link, Navigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Image } from 'semantic-ui-react';
import { FaRegHeart, FaHeart, FaChevronLeft, FaChevronRight  } from "react-icons/fa6";
import './Product.css';

const Product = ({ products, cart, setCart, wishlist, setWishlist }) => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [status, setStatus] = useState({
    cart: {
       isIn: cart.find(item => item._id === id) ? true : false
    }, 
    wishlist: {
      isIn: wishlist.find(item => item._id === id) ? true : false
    }});

  const product = products.find(item => item._id === id);
  if(!product){
    return (
      <Navigate to="/ProductNotFound" replace />
    );
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleCart = () => {
    const productWithDetails = { ...product, selectedQuantity: quantity, selectedColor };

    if (!status.cart.isIn) {
      setCart([...cart, productWithDetails]);
      setStatus((prevStatus) => ({
        ...prevStatus,
        cart: { isIn: true }
      }));
    } else {
      setCart(cart.filter((item) => item._id !== product._id));
      setStatus((prevStatus) => ({
        ...prevStatus,
        cart: { isIn: false }
      }));
    }
  };

  const handleWishlist = () => {
    if (!status.wishlist.isIn) {
      setWishlist([...wishlist, product]);
      setStatus((prevStatus) => ({
        ...prevStatus,
        wishlist: { isIn: true }
      }));
    } else {
      setWishlist(wishlist.filter((item) => item._id !== product._id));
      setStatus((prevStatus) => ({
        ...prevStatus,
        wishlist: { isIn: false }
      }));
    }
  };

  return (
    <div className="product-container">
      <div className="product-navigation">
        <Link to="/products">Shop</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="product-grid">
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>

          <div className="price-rating">
            <span className="price">${product.price}</span>
            <div className="rating-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className="star"
                >
                  ★
                </span>
              ))}
              <span className="rating-text">
                {product.rating} / 5.0 | {product.totalRatings} reviews
              </span>
            </div>
          </div>

          <p className="product-description">
            {product.description}
          </p>

          <div className="color-options">
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                className={`color-option ${selectedColor === idx ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(idx)}
              />
            ))}
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <button 
                className="quantity-button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              >
                -
              </button>
              <input
                type="number"
                className="quantity-input"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
              />
              <button 
                className="quantity-button"
                onClick={() => setQuantity(prev => prev + 1)}
              >
                +
              </button>
            </div>
            {status.cart.isIn ? (
              <div className='remove-button-container'>
                <button onClick={handleCart} className='remove-from-cart'>
                  Remove from Cart
                </button>
                <Link to={"/cart"}><h3>Go to cart</h3></Link>
              </div>
            ) : (
              <button onClick={handleCart} className='add-to-cart'>
                Add to Cart
              </button>
            )}
          </div>

          {status.wishlist.isIn ? (
            <button onClick={handleWishlist} className='remove-from-wishlist'>
              <FaHeart color='red' size={20} />
              Remove from Wishlist
            </button>
          ) : (
            <button onClick={handleWishlist} className='add-to-wishlist'>
              <FaRegHeart size={20} />
              Add to Wishlist
            </button>
          )}

        </div>
        <div className="product-images">
          <div className="main-image">
            <Image 
              src={product.images[selectedImage]} 
              alt={product.name} 
            />
            <button 
              className="nav-button prev"
              onClick={() => setSelectedImage(prev => 
                prev === 0 ? product.images.length - 1 : prev - 1
              )}
            >
              <FaChevronLeft />
            </button>
            <button 
              className="nav-button next"
              onClick={() => setSelectedImage(prev => 
                prev === product.images.length - 1 ? 0 : prev + 1
              )}
            >
              <FaChevronRight />
            </button>
          </div>

          <div className="thumbnail-grid">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;