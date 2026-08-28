import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Checkout = () => {
  const { items, fetchCart } = useCart();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [cep, setCep] = useState('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const total = shippingCost !== null ? subtotal + shippingCost : subtotal;

  const handleCalculateShipping = async () => {
    if (!cep) return;
    setCalculating(true);
    setError('');
    try {
      const res = await api.post('/shipping/calculate', { cep });
      setShippingCost(res.data.shipping_cost);
    } catch {
      setError(t('errorShipping'));
    } finally {
      setCalculating(false);
    }
  };

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (shippingCost === null) {
      setError(t('shippingBeforeCheckout'));
      return;
    }

    setPlacing(true);
    setError('');
    try {
      const res = await api.post('/orders', { shipping_cep: cep });
      await fetchCart();
      navigate(`/orders/${res.data.id}`);
    } catch {
      setError(t('errorOrder'));
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return <div className="container page-shell empty-state text-center">{t('cartEmpty')}</div>;
  }

  return (
    <div className="container page-shell checkout-page">
      <div className="checkout-heading text-center">
        <p className="eyebrow mb-2">{t('checkoutLastStep')}</p>
        <h1 className="display-6 mb-2">{t('checkout')}</h1>
        <p className="text-secondary mb-0">{t('checkoutSubtitle')}</p>
      </div>

      <div className="card summary-card border-0 shadow-sm p-4">
        {error && <div className="alert alert-danger py-2">{error}</div>}

        <h2 className="h6 mb-3">{t('deliveryAddress')}</h2>
        <div className="d-flex gap-2 mb-4">
          <input
            type="text"
            className="form-control"
            placeholder={t('cityZip')}
            value={cep}
            onChange={(e) => {
              setCep(e.target.value);
              setShippingCost(null);
            }}
          />
          <button
            type="button"
            className="btn btn-outline-secondary text-nowrap"
            onClick={handleCalculateShipping}
            disabled={calculating || !cep}
          >
            {calculating ? t('calculating') : t('calculateShipping')}
          </button>
        </div>

        <h2 className="h6 mb-3">{t('payment')}</h2>
        <p className="small text-secondary mb-4">
          {t('checkoutSimulated')}
        </p>

        <hr />

        <div className="d-flex justify-content-between mb-2">
          <span className="text-secondary">{t('subtotal')}</span>
          <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-secondary">{t('freight')}</span>
          <span>{shippingCost !== null ? `R$ ${shippingCost.toFixed(2).replace('.', ',')}` : '—'}</span>
        </div>
        <div className="d-flex justify-content-between fw-semibold mb-4">
          <span>{t('total')}</span>
          <span>R$ {total.toFixed(2).replace('.', ',')}</span>
        </div>

        <button className="btn btn-primary w-100" onClick={handlePlaceOrder} disabled={placing}>
          {placing ? t('processing') : t('confirmOrder')}
        </button>
      </div>
    </div>
  );
};

export default Checkout;