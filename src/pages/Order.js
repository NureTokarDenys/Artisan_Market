
import { Link, useParams } from 'react-router-dom';
import './Order.css';

const Order = () => {
const { id } = useParams();
const shortOrderNumber = id.slice(-8);

  return (
    <main className='order-details-container'>
      <div className="order-navigation">
              <Link to="/orders">Orders</Link>
              <span>/</span>
              <span>#{shortOrderNumber}</span>
      </div>

        Order #{shortOrderNumber}
    </main>
  )
}

export default Order