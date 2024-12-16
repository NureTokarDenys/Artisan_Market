import ProductCard from "../components/ProductCard";
import Sorting from "../components/Sorting";
import "./Shop.css";

const Shop = ({ products, sortOptions, sort, setSort, wishlist, setWishlist }) => {

  const isEmpty = (products.filter((product) => product.status === "Active").length || 0) === 0;
  if(isEmpty){
    return (
      <main className='empty-shop'>
        <h1 className='empty-shop-header'>There are no products availible</h1>
        <h3 className='empty-shop-text'>Please try again later</h3>
      </main>
    );
  }

  return (
    <main className="shop">
      <Sorting h1={"Explore Handmade Items"} h2={"Browse our collection of handcrafted, one-of-a-kind products made by artisans"} sortOptions={sortOptions} sort={sort} setSort={setSort} />
      <div className="product-list">
      {products
        .filter((product) => product.status === "Active")
        .map((product) => (
          <ProductCard key={product._id} product={product} wishlist={wishlist} setWishlist={setWishlist} />
        ))}
      </div>
    </main>
  );
};

export default Shop;