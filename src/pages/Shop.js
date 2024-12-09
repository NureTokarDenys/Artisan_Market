import ProductCard from "../components/ProductCard";
import Sorting from "../components/Sorting";
import "./Shop.css";

const Shop = ({ products, sortOptions, sort, setSort, wishlist, setWishlist }) => {
  return (
    <main className="shop">
      <Sorting h1={"Explore Handmade Items"} h2={"Browse our collection of handcrafted, one-of-a-kind products made by artisans"} sortOptions={sortOptions} sort={sort} setSort={setSort} />
      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} wishlist={wishlist} setWishlist={setWishlist} />
        ))}
      </div>
    </main>
  );
};

export default Shop;