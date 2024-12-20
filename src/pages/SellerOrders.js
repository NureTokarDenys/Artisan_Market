import OrdersTable from '../components/SellerOrdersTable';
import Sorting from '../components/Sorting';
import './SellerOrders.css';

const SellerOrders = ({ orders = [], sort, setSort, sortOptions }) => {
    const isEmpty = (orders?.length || 0) === 0;
    if(isEmpty){
      return (
        <main className='empty-seller-orders'>
          <h1 className='empty-seller-orders-header'>You have not recieved any orders yet</h1>
          <h2> Visit this page later </h2>
        </main>
      );
    }

    const totalOrders = orders.length;
    const OrderInProgress = orders.filter(order => order.status === "In progress").length;
    const CompletedOrders = orders.filter(order => order.status === "Completed").length;
    const CancelledOrders = orders.filter(order => order.status === "Cancelled").length;

    return (
        <main className='seller-orders-container'>
            <Sorting h1={"Order Management Dashboard"} h2={""} sort={sort} setSort={setSort} sortOptions={sortOptions} />
            <div className='seller-order-stats'> 
                <h4>Total orders: <strong>{totalOrders}</strong></h4>
                <h4>Orders In Progress: <strong>{OrderInProgress}</strong></h4>
                <h4>Comleted Orders: <strong>{CompletedOrders}</strong></h4>
                <h4>Cancelled Orders: <strong>{CancelledOrders}</strong></h4>
            </div>
            <OrdersTable orders={orders} />
        </main>
    )
}

export default SellerOrders