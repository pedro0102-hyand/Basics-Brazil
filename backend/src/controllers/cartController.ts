import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Get the authenticated user's cart items
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT
        ci.id AS cart_item_id,
        ci.quantity,
        p.id AS product_id,
        p.name,
        p.price,
        p.stock_quantity,
        p.weight_kg,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) AS image_url
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = $1
       ORDER BY ci.created_at DESC`,
      [req.user!.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Add an item to the authenticated user's cart
export const addToCart = async (req: AuthRequest, res: Response) => {
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'product_id e quantity (maior que 0) são obrigatórios.' });
  }

  try {
    const product = await pool.query(
      'SELECT id, stock_quantity FROM products WHERE id = $1 AND is_active = TRUE',
      [product_id]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    if (product.rows[0].stock_quantity < quantity) {
      return res.status(400).json({ message: 'Estoque insuficiente.' });
    }

    const result = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [req.user!.id, product_id, quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'quantity deve ser maior que 0.' });
  }

  try {
    const result = await pool.query(
      `UPDATE cart_items SET quantity = $1
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [quantity, itemId, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item do carrinho não encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response) => {
  const { itemId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [itemId, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item do carrinho não encontrado.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};