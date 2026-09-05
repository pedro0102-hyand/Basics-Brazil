import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { sendServerError } from '../middleware/errorHandler';

// Controller para lidar com as operações relacionadas a avaliações (reviews) de produtos.
export const getReviews = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; // id do produto

  try {
    const result = await pool.query(
      `SELECT r.id, r.rating, r.created_at, u.name AS user_name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [id]
    );

    const avgResult = await pool.query(
      `SELECT ROUND(AVG(rating)::numeric, 1) AS average, COUNT(*) AS total
       FROM reviews WHERE product_id = $1`,
      [id]
    );

    res.json({
      reviews: result.rows,
      average_rating: avgResult.rows[0].average || 0,
      total_reviews: parseInt(avgResult.rows[0].total, 10),
    });
  } catch (error) {
    sendServerError(res, error, 'reviews.list');
  }
};

// Controller para criar ou atualizar uma avaliação (review) de um produto.
export const createReview = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; // id do produto
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'rating deve ser um número entre 1 e 5.' });
  }

  try {
    const product = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    const result = await pool.query(
      `INSERT INTO reviews (product_id, user_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (product_id, user_id)
       DO UPDATE SET rating = EXCLUDED.rating
       RETURNING *`,
      [id, req.user!.id, rating]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    sendServerError(res, error, 'reviews.create');
  }
};