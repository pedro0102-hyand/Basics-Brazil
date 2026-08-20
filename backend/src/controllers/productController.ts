import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

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

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const productResult = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND is_active = TRUE',
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    const imagesResult = await pool.query(
      'SELECT id, image_url, is_primary FROM product_images WHERE product_id = $1',
      [id]
    );

    res.json({
      ...productResult.rows[0],
      images: imagesResult.rows,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  const { name, description, price, stock_quantity, category, size, color, weight_kg } = req.body;

  if (!name || !description || price === undefined || !category) {
    return res.status(400).json({ message: 'Nome, descrição, preço e categoria são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock_quantity, category, size, color, weight_kg, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        name,
        description,
        price,
        stock_quantity ?? 0,
        category,
        size ?? null,
        color ?? null,
        weight_kg ?? 0.3,
        req.user!.id,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};