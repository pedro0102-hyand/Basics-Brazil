import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'react-bootstrap-icons';
import api from '../services/api';

interface OrderItem {
  quantity: number;
  unit_price: string;
  product_name: string;
}

interface Order {
  id: number;
  status: string;
  subtotal: string;
  shipping_cost: string;
  total: string;
  shipping_cep: string;
  created_at: string;
  items: OrderItem[];
}

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => {
      setOrder(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="container py-5">Carregando...</div>;
  if (!order) return <div className="container py-5">Pedido não encontrado.</div>;

  return (
    <div className="container py-5" style={{ maxWidth: '560px' }}>
      <div className="text-center mb-4">
        <CheckCircle size={48} className="text-success mb-3" />
        <h1 className="h3 mb-1">Pedido Confirmado!</h1>
        <p className="text-secondary">Pedido #{order.id} — {order.status === 'paid' ? 'Pago' : order.status}</p>
      </div>

      <div className="card border-0 shadow-sm p-4">
        <h2 className="h6 mb-3">Itens</h2>
        <ul className="list-unstyled mb-3">
          {order.items.map((item, i) => (
            <li key={i} className="d-flex justify-content-between small mb-2">
              <span>
                {item.quantity}x {item.product_name}
              </span>
              <span>R$ {(parseFloat(item.unit_price) * item.quantity).toFixed(2).replace('.', ',')}</span>
            </li>
          ))}
        </ul>

        <hr />

        <div className="d-flex justify-content-between mb-2">
          <span className="text-secondary">Subtotal</span>
          <span>R$ {parseFloat(order.subtotal).toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-secondary">Frete</span>
          <span>R$ {parseFloat(order.shipping_cost).toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="d-flex justify-content-between fw-semibold mb-2">
          <span>Total</span>
          <span>R$ {parseFloat(order.total).toFixed(2).replace('.', ',')}</span>
        </div>
        <p className="small text-secondary mb-0">Entrega para o CEP {order.shipping_cep}</p>
      </div>

      <div className="text-center mt-4">
        <Link to="/" className="btn btn-outline-secondary">
          Voltar às Compras
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;