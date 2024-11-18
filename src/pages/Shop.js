import ProductCard from "../components/ProductCard";
import "./Shop.css";

const Shop = ({ products }) => {
  return (
    <main className="shop">
      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
};

export default Shop;