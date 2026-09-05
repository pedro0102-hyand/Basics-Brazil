import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { sendServerError } from '../middleware/errorHandler';

export const getComments = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; // id do produto

  try {
    const result = await pool.query(
      `SELECT c.id, c.content, c.created_at, u.name AS user_name
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.product_id = $1
       ORDER BY c.created_at DESC`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    sendServerError(res, error, 'comments.get');
  }
};

export const createComment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'content é obrigatório.' });
  }

  try {
    const product = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    const result = await pool.query(
      `INSERT INTO comments (product_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, req.user!.id, content.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    sendServerError(res, error, 'comments.create');
  }
};