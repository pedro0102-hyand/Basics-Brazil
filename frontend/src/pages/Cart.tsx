import { Link, useNavigate } from 'react-router-dom';
import { Trash } from 'react-bootstrap-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <p>Você precisa estar logado para ver o carrinho.</p>
        <Link to="/login" className="btn btn-primary">
          Entrar
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <p className="text-secondary">Seu carrinho está vazio.</p>
        <Link to="/" className="btn btn-primary">
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="h3 mb-4">Meu Carrinho</h1>

      <div className="row g-5">
        <div className="col-md-8">
          {items.map((item) => (
            <div key={item.cart_item_id} className="d-flex gap-3 align-items-center border-bottom pb-3 mb-3">
              <img
                src={
                  item.image_url
                    ? `http://localhost:3001${item.image_url}`
                    : 'https://placehold.co/80x80?text=Sem+imagem'
                }
                alt={item.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                className="rounded"
              />

              <div className="flex-grow-1">
                <p className="mb-1 fw-semibold">{item.name}</p>
                <p className="mb-0 small text-secondary">
                  R$ {parseFloat(item.price).toFixed(2).replace('.', ',')}
                </p>
              </div>

              <input
                type="number"
                className="form-control"
                style={{ width: '70px' }}
                min={1}
                max={item.stock_quantity}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.cart_item_id, Number(e.target.value))}
              />

              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeItem(item.cart_item_id)}
              >
                <Trash />
              </button>
            </div>
          ))}
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h6 mb-3">Resumo</h2>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <p className="small text-secondary mb-3">Frete calculado no checkout</p>
              <button className="btn btn-primary w-100" onClick={() => navigate('/checkout')}>
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;