
import { useNavigate } from 'react-router-dom';
import './OrderCard.css';
import ProfileButton from './ProfileButton';

const OrderCard = ({ className = 'order-card-container', order }) => {
  const navigate = useNavigate();

  let statusColor = "#000";
  switch(order.status){
    case "In progress":
      statusColor = "#8E8E93";
    break;
  }

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(order.createdAt));

  const handleRepeatOrder = () => {

  }

  const handleViewDetails = () => {
    navigate(`/orders/${order._id}`);
  }

  return (
    <div className={className}>
      <div className='order-header'>
        Order #{order._id.slice(-8)}
      </div>
      <div className='order-info'>
        <h3>Date: {formattedDate}</h3>
        <h3>Total Price: ${order.totalPrice} </h3>
        <h3 className='order-info-status-container'>Status: <p style={{color: statusColor}}>{order.status}</p></h3>
      </div>
      <div className='order-actions'>
        <ProfileButton title='Repeat Order' className='order-action-button' bgColor='#84A98C' hoverColor='#3acf46' textColor='#ffffff' action={handleRepeatOrder}/>
        <ProfileButton title='View Details' className='order-action-button' hoverColor='#d3d3d3' textColor='#4B72C2' action={handleViewDetails}/>
      </div>
    </div>
  )
}

export default OrderCard