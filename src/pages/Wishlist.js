import { useState } from 'react';
import './Wishlist.css';
import ProductCard from '../components/ProductCard';
import Sorting from '../components/Sorting';
import { Link } from 'react-router-dom';

const Wishlist = ({ wishlist, setWishlist, sortOptions }) => {
  const [sort, setSort] = useState(0);

  const isEmpty = (wishlist?.length || 0) === 0;
  if(isEmpty){
    return (
      <main className='empty-wishlist'>
        <h1 className='empty-header'>Your wishlist is empty</h1>
        <Link to="/products" className='empty-link'><h3 className='empty-link-text'>Add something</h3></Link>
      </main>
    );
  }

  return (
    <main className="shop">
      <Sorting h1={"Your Wishlist"} h2={"Save your favorite items to purchase later."} sortOptions={sortOptions} sort={sort} setSort={setSort} />
      <div className="product-list">
        {wishlist.map((product) => (
          <ProductCard key={product._id} product={product} wishlist={wishlist} setWishlist={setWishlist} />
        ))}
      </div>
    </main>
  );
};

export default Wishlist;