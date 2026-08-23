import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Product } from '../types/product';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products', {
          params: search ? { search } : {},
        });
        setProducts(res.data);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchProducts, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);
  return (
    <div className="container py-5 py-md-6">
      <div className="text-center mb-5">
        <h1 className="display-6 mb-2">Nossa Coleção</h1>
        <p className="text-secondary">Peças essenciais para o seu dia a dia</p>
      </div>

      <div className="d-flex justify-content-end mb-4">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: '280px' }}
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-secondary">Carregando produtos...</p>
      ) : products.length === 0 ? (
        <p className="text-secondary">Nenhum produto encontrado.</p>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {products.map((product) => (
            <div className="col" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;