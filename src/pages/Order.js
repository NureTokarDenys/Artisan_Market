import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Loader } from '../components/Loader';
import CartProduct from '../components/CartProduct';
import { FaCheck } from "react-icons/fa6";
import ProfileButton from '../components/ProfileButton';
import './Order.css';

const Order = ({ orders, user = 'buyer' }) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const isBuyer = user === 'buyer';
  const { id } = useParams();
  const shortOrderNumber = id.slice(-8);

  const order = isBuyer ? orders.find(item => item._id === id) : orders.find(item => item.orderId === id);
  if(!order){
    return (
      <Navigate to="/OrderNotFound" replace />
    );
  }

  const isoString = order.createdAt; 
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const orderDate = `${day}/${month}/${year}`;

  const [orderStatus, setOrderStatus] = useState(order.status);

  const [username, setUsername] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const paymentMethod = order.payment === "online_card" ? "Online Payment" : "Upon Receipt" ;

  useEffect(() => {
          const getUsername = async () => {
            let userId = order.buyerId;
            if(isBuyer) userId = order.orderDetails[0].userId;

            const response = await axiosPrivate.get(`/api/userinfo/${userId}`);
            setUsername(response.data.username);
            setUserEmail(response.data.email);
            setIsLoadingProfile(false);
          }
          getUsername();

  }, []);

  const getStatusClass = (status) => {
    switch (status) {
    case "In progress":
        return "order-row-status-pending";
    case "Completed":
        return "order-row-status-completed";
    case "Cancelled":
        return "order-row-status-canceled";
    default:
        return "";
    }
  };
    
  const shippingCost = isBuyer ? order.orderDetails.reduce((total, item) => (total + item.selectedQuantity / 2), 1) : order.products.reduce((acc, item) => acc + item.selectedQuantity / 2, 1);
  const orderTotalCost = isBuyer ? order.orderDetails.reduce((total, item) => (total + item.price * item.selectedQuantity + (item.selectedQuantity / 2)), 1) : order.products.reduce((total, item) => (total + item.price * item.selectedQuantity + (item.selectedQuantity / 2)), 1);

  const backToOrders = () => {
    if(isBuyer){
      navigate("/orders");
    }else {
      navigate("/myorders");
    }
  }

  const [showConfirm, setShowConfirm] = useState(false);

  const handleOrderCancellation = () => {
    setShowConfirm((prev) => !prev);
  }

  const confirmCancellation = async () => {
    try {
      const result = await axiosPrivate.post(`/api/orders/status/${order._id}`, { status: "Cancelled" });

      setOrderStatus("Cancelled");
      order.status = "Cancelled";
      alert("Order cancelled!");
    } catch {
      alert("Something went wrong!");
    }
    
    setShowConfirm(false);
  };

  const cancelDialog = () => {
    setShowConfirm(false);
  };

  return (
    <main className='order-details-container'>
      <Breadcrumbs className='order-bread-crumps' links={[ 
        { name: "My orders", link: isBuyer ? "/orders" : "/myorders" },
        { name: "#" + shortOrderNumber }]} 
      />

      <h1 className='order-head'>Order #{shortOrderNumber}</h1>
      <div className='order-contact-info'>
        <h2>Contact information</h2>
          {isLoadingProfile ? <>
            <Loader className='order-loader' size='sm' color='blue' />
            </> : <> 
              <h4>Email: <strong>{userEmail}</strong></h4>
              <h4>Name: <strong>{username}</strong></h4>
              <h4>Adress: <strong>{order.delivery}</strong></h4>
            </>
          }
      </div>
      <div className='order-detailss-container'>
          <h1>Order details</h1>
          <div className='order-detailss'>
            <div className='order-detailss-main'>
              <div className='order-detailed-products-list'>
              {isBuyer ? <>
                {order.orderDetails.map((product) => (
                  <CartProduct key={product._id} product={product} isOrderUsed={true} />
                ))}
                </> : <>
                {order.products.map((product) => (
                  <CartProduct key={product._id} product={product} isOrderUsed={true} />
                ))}
                </>
              } 
            
              </div>
              <div className='order-payment-info'>
                <h3>Payment Information</h3>
                <h4 className='order-check'>Payment Method: {paymentMethod} {paymentMethod == "Online Payment" && <FaCheck color='green' />}</h4>
              </div>
            </div>
            <div className='order-detailss-side'>
              <div className='order-detailss-side-sum'>
                <h1>Order Summary</h1>
                <div className='order-sum-date'>
                  <h3>Date</h3>
                  <p>{orderDate}</p>
                </div>
                <div className='order-sum-status'>
                  <h3>Status</h3>
                  <p className={getStatusClass(orderStatus)}>{orderStatus}</p>
                </div>
                <div className='order-dividor'></div>
                <div className='order-sum-coupon'>
                  <h3>Coupon Applied</h3>
                  <p>$0.00</p>
                </div>
                <div className='order-sum-shipping'>
                  <h3>Shipping</h3>
                  <p>${shippingCost}</p>
                </div>
                <div className='order-sum-total'>
                  <h3>Total</h3>
                  <p>${orderTotalCost}</p>
                </div>
              </div>
              <div className='order-sum-actions'>
                <ProfileButton title='Back To Orders' action={backToOrders} border='2px solid #84A98C' textColor='#84A98C' hoverColor='#3acf46' hoverTextColor='#000000' />
                {(isBuyer && order.status != "Cancelled") && 
                  <ProfileButton title="Cancel Order" action={handleOrderCancellation} textColor="#ffffff" bgColor="#d64545" hoverColor="#f07a7a" />
                }
              </div>
              {showConfirm && (
                      <div className='cancellation-confirm-container'>
                        <p>Are you sure you want to cancel the order?</p>
                        <ProfileButton className='confirm-button confirm-button-yes' title='Yes' action={confirmCancellation} border='2px solid #d64545' textColor='#d64545' hoverColor="#f07a7a" hoverTextColor='#000000' />
                        <ProfileButton className='confirm-button confirm-button-no' title='No' action={cancelDialog} border='2px solid #84A98C' textColor='#84A98C' hoverColor='#3acf46' hoverTextColor='#000000' />
                      </div>
                    )}
            </div>
          </div>
      </div>
    </main>
  )
}

export default Order