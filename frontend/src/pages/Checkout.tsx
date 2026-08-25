import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { items, fetchCart } = useCart();
  const navigate = useNavigate();

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
      setError('Não foi possível calcular o frete.');
    } finally {
      setCalculating(false);
    }
  };

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (shippingCost === null) {
      setError('Calcule o frete antes de finalizar.');
      return;
    }

    setPlacing(true);
    setError('');
    try {
      const res = await api.post('/orders', { shipping_cep: cep });
      await fetchCart();
      navigate(`/orders/${res.data.id}`);
    } catch {
      setError('Não foi possível concluir o pedido.');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return <div className="container py-5 text-center">Seu carrinho está vazio.</div>;
  }

  return (
    <div className="container py-5" style={{ maxWidth: '560px' }}>
      <h1 className="h3 mb-4 text-center">Finalizar Compra</h1>

      <div className="card border-0 shadow-sm p-4">
        {error && <div className="alert alert-danger py-2">{error}</div>}

        <h2 className="h6 mb-3">Endereço de Entrega</h2>
        <div className="d-flex gap-2 mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="CEP (ex: 20950-000)"
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
            {calculating ? 'Calculando...' : 'Calcular Frete'}
          </button>
        </div>

        <h2 className="h6 mb-3">Pagamento</h2>
        <p className="small text-secondary mb-4">
          Este é um checkout simulado — nenhum pagamento real será processado.
          O pedido será aprovado automaticamente.
        </p>

        <hr />

        <div className="d-flex justify-content-between mb-2">
          <span className="text-secondary">Subtotal</span>
          <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-secondary">Frete</span>
          <span>{shippingCost !== null ? `R$ ${shippingCost.toFixed(2).replace('.', ',')}` : '—'}</span>
        </div>
        <div className="d-flex justify-content-between fw-semibold mb-4">
          <span>Total</span>
          <span>R$ {total.toFixed(2).replace('.', ',')}</span>
        </div>

        <button className="btn btn-primary w-100" onClick={handlePlaceOrder} disabled={placing}>
          {placing ? 'Processando...' : 'Confirmar Pedido'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;