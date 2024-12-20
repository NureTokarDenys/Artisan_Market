import OrderRow from "./SellerOrdersTableRow";
import "./SellerOrdersTable.css";

const OrdersTable = ({ orders }) => {
  return (
    <div className="orders-table-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Buyer</th>
            <th>Total Cost</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow key={order.orderId} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;