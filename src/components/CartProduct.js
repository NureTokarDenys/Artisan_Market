import { Image } from 'semantic-ui-react';
import './CartProduct.css';

const CartProduct = ({ product, cart, setCart }) => {

    const removeFromCart = () => {
        setCart(cart.filter(item => item._id !== product._id));
    }

    const handleQuantityPlus = () => {
        setCart(cart.map(item => item._id === product._id ? { ...item, selectedQuantity: item.selectedQuantity + 1 } : item ));
    }

    const handleQuantityMinus = () => {
        setCart(cart.map(item => item._id === product._id ? { ...item, selectedQuantity: Math.max(1, item.selectedQuantity - 1) } : item ));
    }

  return (
    <div className='cart-product'>
        <div className='cart-product-image'>
            <Image src={product.images[0]} alt={product.name} />
        </div>
        <h3 className='cart-product-name'>{product.name}</h3>
        <div className='cart-product-colorContainer'>
            <p className='cart-product-color'>Color: </p>
            <p style={{ backgroundColor: product.colors[product.selectedColor] }} className='color-display'></p>
        </div>
        <div className='cart-product-quantity'>
            <button onClick={handleQuantityMinus} className='cart-product-decrement'>-</button>
            <span className='cart-product-count'>{product.selectedQuantity}</span>
            <button onClick={handleQuantityPlus} className='cart-product-increment'>+</button>
        </div>
        <div className='cart-product-price'>${product.price.toFixed(2)}</div>
        <button onClick={removeFromCart} className='cart-product-remove'>Remove</button>
    </div>
  );
};

export default CartProduct;