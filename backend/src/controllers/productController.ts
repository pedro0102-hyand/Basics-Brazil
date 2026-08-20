import { Request, Response } from 'express';
import pool from '../config/database';

export const getProducts = async (req: Request, res: Response) => {
  const { category, search } = req.query;

  try {
    let query = 'SELECT * FROM products WHERE is_active = TRUE';
    const params: string[] = [];

    if (category) {
      params.push(category as string);
      query += ` AND category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND name ILIKE $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};