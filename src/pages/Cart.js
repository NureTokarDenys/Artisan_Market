import { Link, useNavigate } from 'react-router-dom';
import CartProduct from '../components/CartProduct';
import './Cart.css';
import ProfileButton from '../components/ProfileButton';

const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  }

  const isEmpty = (cart?.length || 0) === 0;
  if(isEmpty){
    return (
      <main className='empty-cart'>
        <h1 className='empty-cart-header'>Your cart is empty</h1>
        <Link to="/products" className='empty-cart-link'><h3 className='empty-cart-link-text'>Add something</h3></Link>
      </main>
    );
  }

  return (
    <main className="cart-container">
      <div className="cart-product-list">
        <div className="cart-product-list-details">
          <p className="cart-product-list-details-main">Cart</p>
          <p className="cart-product-list-details-side">{cart.length === 1 ? "1 Item" : (cart.length + " Items")}</p>
        </div>
        {cart.map((product) => (
          <CartProduct key={product._id} product={product} cart={cart} setCart={setCart} />
        ))}
      </div>
      <div className='cart-summary'>
        <h1>Order Summary</h1>
        <div className='cart-price'>
          <h3>Price</h3>
          <p>${cart.reduce((acc, item) => acc + (item.price * item.selectedQuantity), 0).toFixed(2)}</p>
        </div>
        <div className='cart-coupon'>
          <h3>Coupon Applied</h3>
          <p>$0.00</p>
        </div>
        <div className='cart-dividor'></div>
        <div className='cart-total'>
          <h3>Total</h3>
          <p>${cart.reduce((acc, item) => acc + (item.price * item.selectedQuantity), 0).toFixed(2)}</p>
        </div>

        <ProfileButton className={"cart-button"} title={"Proceed to Checkout"} textColor={"#ffffff"} bgColor={"#84a98c"} hoverColor={"#3acf46"} action={handleCheckout} />
      </div>
    </main>
  );
};

export default Cart;