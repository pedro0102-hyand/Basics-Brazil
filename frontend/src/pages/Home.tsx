import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Product } from '../types/products';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';

interface Category {
  category: string;
  count: string;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    api.get('/products/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (selectedCategory) params.category = selectedCategory;

        const res = await api.get('/products', { params });
        setProducts(res.data);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchProducts, 400);
    return () => clearTimeout(delayDebounce);
  }, [search, selectedCategory]);

  return (
    <div className="container page-shell">
      <div className="page-heading text-center">
        <p className="eyebrow mb-2">Basics Brazil</p>
        <h1 className="display-6 mb-2">Nossa Coleção</h1>
        <p className="text-secondary mb-0">Peças essenciais para o seu dia a dia</p>
      </div>

      <div className="row">
        <div className="col-md-3 col-lg-2 mb-4">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        <div className="col-md-9 col-lg-10">
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
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4 product-grid">
              {products.map((product) => (
                <div className="col" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;