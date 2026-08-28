import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'react-bootstrap-icons';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => {
      setOrder(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="container page-shell">{t('loading')}</div>;
  if (!order) return <div className="container page-shell">{t('notFoundOrder')}</div>;

  return (
    <div className="container page-shell confirmation-page">
      <div className="text-center mb-4">
        <CheckCircle size={48} className="text-success mb-3" />
        <h1 className="h3 mb-1">{t('orderConfirmed')}</h1>
        <p className="text-secondary">Pedido #{order.id} — {order.status === 'paid' ? t('orderStatusPaid') : order.status}</p>
      </div>

      <div className="card summary-card border-0 shadow-sm p-4">
        <h2 className="h6 mb-3">{t('items')}</h2>
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
          <span className="text-secondary">{t('subtotal')}</span>
          <span>R$ {parseFloat(order.subtotal).toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-secondary">{t('freight')}</span>
          <span>R$ {parseFloat(order.shipping_cost).toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="d-flex justify-content-between fw-semibold mb-2">
          <span>{t('total')}</span>
          <span>R$ {parseFloat(order.total).toFixed(2).replace('.', ',')}</span>
        </div>
        <p className="small text-secondary mb-0">{t('deliveryZip')} {order.shipping_cep}</p>
      </div>

      <div className="text-center mt-4">
        <Link to="/" className="btn btn-outline-secondary">
          {t('backToShopping')}
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;