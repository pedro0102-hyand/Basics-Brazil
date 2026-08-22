import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import api from '../services/api';
import { CartItem } from '../types/cart';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToCart = async (productId: number, quantity: number) => {
    await api.post('/cart', { product_id: productId, quantity });
    await fetchCart();
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    await api.put(`/cart/${cartItemId}`, { quantity });
    await fetchCart();
  };

  const removeItem = async (cartItemId: number) => {
    await api.delete(`/cart/${cartItemId}`);
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{ items, loading, fetchCart, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de um CartProvider');
  return context;
};