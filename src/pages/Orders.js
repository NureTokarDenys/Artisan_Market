import { Link } from 'react-router-dom';
import OrderCard from '../components/OrderCard';
import Sorting from '../components/Sorting';
import './Orders.css';

const Orders = ({ sortOptions, sort, setSort, orders }) => {
    const isEmpty = (orders?.length || 0) === 0;
    if(isEmpty){
      return (
        <main className='empty-orders'>
          <h1 className='empty-orders-header'>Your order list is empty</h1>
          <Link to="/cart" className='empty-orders-link'><h3 className='empty-cart-orders-text'>Order something</h3></Link>
        </main>
      );
    }

  return (
    <main className='orders-container'>
        <Sorting h1={"Orders History"} h2={"Manage your orders"} sortOptions={sortOptions} sort={sort} setSort={setSort} />

        <div className='order-list'>
            {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
            ))}
        </div>
    </main>
  )
}

export default Orders