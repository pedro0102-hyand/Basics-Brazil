import { Link } from 'react-router-dom';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const imageUrl = primaryImage
    ? `http://localhost:3001${primaryImage.image_url}`
    : 'https://placehold.co/400x400?text=Sem+imagem';

  return (
    <Link to={`/products/${product.id}`} className="text-decoration-none text-body">
      <div className="card h-100 border-0 shadow-sm">
        <img
          src={imageUrl}
          alt={product.name}
          className="card-img-top"
          style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
        />
        <div className="card-body">
          <p className="text-uppercase small text-secondary mb-1">{product.category}</p>
          <h6 className="card-title mb-1">{product.name}</h6>
          <p className="fw-semibold mb-0">
            R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;