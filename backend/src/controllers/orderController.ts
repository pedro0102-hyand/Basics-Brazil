import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { calculateShippingCost, ShippingMethod } from '../utils/shipping';
import { sendServerError } from '../middleware/errorHandler';

export const createOrder = async (req: AuthRequest, res: Response) => {
  const { shipping_cep, payment_method = 'fake_card', shipping_method = 'standard' } = req.body;

  if (!shipping_cep) {
    return res.status(400).json({ message: 'shipping_cep é obrigatório.' });
  }

  const allowedMethods = ['standard', 'express', 'pickup'];
  if (!allowedMethods.includes(shipping_method)) {
    return res.status(400).json({ message: 'Método de entrega inválido.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const cartResult = await client.query(
      `SELECT ci.id AS cart_item_id, ci.quantity, p.id AS product_id, p.price, p.stock_quantity, p.weight_kg
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = $1
       FOR UPDATE OF p`,
      [req.user!.id]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Carrinho vazio.' });
    }

    for (const item of cartResult.rows) {
      if (item.quantity > item.stock_quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: `Estoque insuficiente para o produto ${item.product_id}.` });
      }
    }

    const subtotal = cartResult.rows.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    const totalWeight = cartResult.rows.reduce(
      (sum, item) => sum + parseFloat(item.weight_kg) * item.quantity,
      0
    );
    const shippingCost = calculateShippingCost(totalWeight, shipping_method as ShippingMethod);
    const total = subtotal + shippingCost;

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, status, subtotal, shipping_cost, total, shipping_cep, payment_method)
       VALUES ($1, 'paid', $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user!.id, subtotal, shippingCost, total, shipping_cep, payment_method || 'fake_card']
    );
    const order = orderResult.rows[0];

    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );

      await client.query(
        `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.user!.id]);

    await client.query('COMMIT');

    res.status(201).json(order);
  } catch (error) {
    await client.query('ROLLBACK');
    sendServerError(res, error, 'orders.create');
  } finally {
    client.release();
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user!.id]
    );
    res.json(result.rows);
  } catch (error) {
    sendServerError(res, error, 'orders.list');
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, req.user!.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    const itemsResult = await pool.query(
      `SELECT oi.quantity, oi.unit_price, p.name AS product_name
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`,
      [id]
    );

    res.json({
      ...orderResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    sendServerError(res, error, 'orders.get');
  }
};