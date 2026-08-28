import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PencilSquare, Trash, PlusCircle } from 'react-bootstrap-icons';
import api from '../services/api';
import type { Product } from '../types/products';
import { translateCategory, useLanguage } from '../context/LanguageContext';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  const fetchProducts = async () => {
    setLoading(true);
    const res = await api.get('/products');
    setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDelete'))) return;
    await api.delete(`/products/${id}`);
    await fetchProducts();
  };

  return (
    <div className="container page-shell admin-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="eyebrow mb-2">{t('adminPanel')}</p>
          <h1 className="display-6 mb-0">{t('manageProducts')}</h1>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary d-flex align-items-center gap-2">
          <PlusCircle /> {t('newProduct')}
        </Link>
      </div>

      {loading ? (
        <p>{t('loading')}</p>
      ) : (
        <div className="table-responsive admin-table-wrap">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>{t('name')}</th>
                <th>{t('category')}</th>
                <th>{t('total')}</th>
                <th>{t('stock')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{translateCategory(p.category, language)}</td>
                  <td>R$ {parseFloat(p.price).toFixed(2).replace('.', ',')}</td>
                  <td>{p.stock_quantity}</td>
                  <td className="text-end">
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      className="btn btn-sm btn-outline-secondary me-2"
                    >
                      <PencilSquare />
                    </Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;