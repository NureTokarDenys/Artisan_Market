import { Link } from 'react-router-dom';
import { Image } from 'semantic-ui-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <Image
          src={product.images[0]}
          alt={product.name}
          className="product-image"
        />
        <h2 className="product-name">{product.name}</h2>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </Link>
    </div>
  );
};

export default ProductCard;