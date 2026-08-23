import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PencilSquare, Trash, PlusCircle } from 'react-bootstrap-icons';
import api from '../services/api';
import type { Product } from '../types/product';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    await api.delete(`/products/${id}`);
    await fetchProducts();
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Gerenciar Produtos</h1>
        <Link to="/admin/products/new" className="btn btn-primary d-flex align-items-center gap-2">
          <PlusCircle /> Novo Produto
        </Link>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
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