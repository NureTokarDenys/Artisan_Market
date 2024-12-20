import { FaRegUser } from "react-icons/fa6";
import './Checkout.css';
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CartProduct from "../components/CartProduct";
import ProfileButton from "../components/ProfileButton";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/Loader";

const Checkout = ({ profile, cart, setCart, setBuyerOrders }) => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const navigate = useNavigate()
    const [username, setUsername] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        const getUsername = async () => {
            const response = await axiosPrivate.get(`/api/userinfo/${auth?.userId}`);
            setUsername(response.data.username);
            setUserEmail(response.data.email);
            setIsLoadingProfile(false);
        }
        getUsername();

    }, []);

    const handleOrder = async () => {
        const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
        try{
            const response = await axiosPrivate.post('/api/orders/create', {
                userId: auth.userId,
                orderDetails: cart,
                delivery: profile.location,
                payment: selectedPayment,
                totalPrice: cart.reduce((acc, item) => acc + (item.price * item.selectedQuantity) + (item.selectedQuantity / 2), 1).toFixed(2)
            });
            setBuyerOrders((prev) => ([...prev, response.data.order]));
            alert("Order created successfully.");
            setCart([]);
            navigate("/orders"); 
        } catch (error) {

        }
        
    }

  return (
    <main className='checkout-container'>
        <div className="main-checkout-content">
            <h2 className="checkout-header">Order placement</h2>
            <div class="section">
                <div class="section-title">Your contact information</div>
                <div class="section-content">
                    {isLoadingProfile ? <>
                            <div className="checkout-user-info"><FaRegUser /><Loader className="checkout-loader" size="sm" color="red" /></div>
                        </> : <>
                            <div className="checkout-user-info"><FaRegUser /><p>{userEmail}</p></div>
                            <h3>{username}</h3>
                        </>
                    }

                </div>
            </div>
            <div class="section">
                <div class="section-title">Order details</div>
                <div class="section-content">
                    {cart.map((product) => (
                        <CartProduct key={product._id} product={product} cart={cart} setCart={setCart} isOrderUsed={true} />
                    ))}
                </div>
            </div>
            <div class="section">
                <div class="section-title">Shipping</div>
                <div class="section-content">
                    <h3>Self-collection at</h3>
                    <h4>{profile.location}</h4>
                </div>
            </div>
            <div class="section">
                <div class="section-title">Payment</div>
                <div class="section-content">
                    <label className="payment-label">
                        <input type="radio" name="payment" value="upon_receipt" checked /> Payment upon receipt 
                    </label><br />
                    <label className="payment-label">
                        <input type="radio" name="payment" value="online_card" /> Online payment by card
                    </label>
                </div>
            </div>
        </div>
        <div className="side-checkout-content">
            <h1 className="checkout-order-summary">Order Summary</h1>
            <div className='checkout-price'>
                <h3>Price</h3>
                <p>${cart.reduce((acc, item) => acc + (item.price * item.selectedQuantity), 0).toFixed(2)}</p>
            </div>
            <div className='checkout-shipping'>
                <h3>Shipping</h3>
                <p>${cart.reduce((acc, item) => acc + item.selectedQuantity / 2, 1).toFixed(2)}</p>
            </div>
            <div className='checkout-coupon'>
                <h3>Coupon Applied</h3>
                <p>$0.00</p>
            </div>
            <div className='checkout-dividor'></div>
            <div className='checkout-total'>
                <h3>Total</h3>
                <p>${cart.reduce((acc, item) => acc + (item.price * item.selectedQuantity) + (item.selectedQuantity / 2), 1).toFixed(2)}</p>
            </div>
            <ProfileButton className={"checkout-button"} title={"Confirm order"} textColor={"#ffffff"} bgColor={"#84a98c"} hoverColor={"#3acf46"} action={handleOrder} />
        </div>                        
    </main>
  )
}

export default Checkout