
import { Link, useParams } from 'react-router-dom';
import './Order.css';
import Breadcrumbs from '../components/Breadcrumbs';

const Order = () => {
const { id } = useParams();
const shortOrderNumber = id.slice(-8);

  return (
    <main className='order-details-container'>
      <Breadcrumbs links={[ 
        { name: "Orders", link: "/orders" },
        { name: "#" + shortOrderNumber }]} 
      />

        Order #{shortOrderNumber}
    </main>
  )
}

export default Order