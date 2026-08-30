import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const shippingMethods = [
  { value: 'standard', label: 'Padrão', description: 'Entrega em 5 a 7 dias' },
  { value: 'express', label: 'Express', description: 'Entrega em 2 a 3 dias' },
  { value: 'pickup', label: 'Retirar na loja', description: 'Sem custo de entrega' },
] as const;

const paymentMethods = [
  { value: 'fake_card', label: 'Cartão de crédito (simulado)' },
  { value: 'fake_pix', label: 'PIX (simulado)' },
  { value: 'fake_boleto', label: 'Boleto (simulado)' },
] as const;

const Checkout = () => {
  const { items, fetchCart } = useCart();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [cep, setCep] = useState('');
  const [shippingMethod, setShippingMethod] = useState<(typeof shippingMethods)[number]['value']>('standard');
  const [paymentMethod, setPaymentMethod] = useState<(typeof paymentMethods)[number]['value']>('fake_card');
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
      const res = await api.post('/shipping/calculate', { cep, shipping_method: shippingMethod });
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
      const res = await api.post('/orders', {
        shipping_cep: cep,
        shipping_method: shippingMethod,
        payment_method: paymentMethod,
      });
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

        <div className="mb-4">
          <h2 className="h6 mb-3">Forma de entrega</h2>
          <div className="d-flex flex-column gap-2">
            {shippingMethods.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`btn btn-outline-secondary text-start ${shippingMethod === option.value ? 'active' : ''}`}
                onClick={() => {
                  setShippingMethod(option.value);
                  setShippingCost(null);
                }}
              >
                <div className="fw-semibold">{option.label}</div>
                <small className="d-block text-secondary">{option.description}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="h6 mb-3">Pagamento simulado</h2>
          <div className="d-flex flex-column gap-2">
            {paymentMethods.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`btn btn-outline-secondary text-start ${paymentMethod === option.value ? 'active' : ''}`}
                onClick={() => setPaymentMethod(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="small text-secondary mt-3 mb-0">{t('checkoutSimulated')}</p>
        </div>

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