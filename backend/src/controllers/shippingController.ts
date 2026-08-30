import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { calculateShippingCost } from '../utils/shipping';

//
export const calculateShipping = async (req: AuthRequest, res: Response) => {
  const { cep, shipping_method = 'standard' } = req.body;

  if (!cep) {
    return res.status(400).json({ message: 'CEP é obrigatório.' });
  }

  const allowedMethods = ['standard', 'express', 'pickup'];
  if (!allowedMethods.includes(shipping_method)) {
    return res.status(400).json({ message: 'Método de entrega inválido.' });
  }

  try {
    const result = await pool.query(
      `SELECT SUM(p.weight_kg * ci.quantity) AS total_weight
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = $1`,
      [req.user!.id]
    );

    const totalWeight = parseFloat(result.rows[0].total_weight) || 0;

    if (totalWeight === 0) {
      return res.status(400).json({ message: 'Carrinho vazio, não é possível calcular o frete.' });
    }

    const shippingCost = calculateShippingCost(totalWeight, shipping_method);

    res.json({
      cep,
      total_weight_kg: totalWeight,
      shipping_cost: shippingCost,
      shipping_method,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};