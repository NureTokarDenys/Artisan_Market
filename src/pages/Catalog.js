import SellerProductCard from '../components/SellerProductCard';
import Sorting from '../components/Sorting';
import './Catalog.css';

const Catalog = ({ catalog, sortOptions, sort, setSort }) => {
   const isEmpty = (catalog?.length || 0) === 0;
    if(isEmpty){
      return (
        <main className='empty-catalog'>
          <h1 className='empty-catalog-header'>Your catalog is empty</h1>
          <h2> Add product </h2>
        </main>
      );
    }

  return (
    <main className='catalog-container'> 
      <Sorting h1={"Your catalog"} h2={"Manage your products efficiently"} sortOptions={sortOptions} sort={sort} setSort={setSort} />
      <div className='catalog-product-list'>
        {catalog.map((product) => (
            <SellerProductCard key={product._id} product={product} />
          ))}
      </div>
    </main>
  )
}

export default Catalog