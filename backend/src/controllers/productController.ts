// CRUD dos produtos

import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Get all products with optional filtering by category and search term
export const getProducts = async (req: Request, res: Response) => {
  const { category, search } = req.query;

  try {
    let query = `
      SELECT
        p.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'image_url', pi.image_url,
              'is_primary', pi.is_primary
            )
            ORDER BY pi.is_primary DESC, pi.id ASC
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'::json
        ) AS images
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE p.is_active = TRUE
    `;
    const params: string[] = [];

    if (category) {
      params.push(category as string);
      query += ` AND p.category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND p.name ILIKE $${params.length}`;
    }

    query += ' GROUP BY p.id ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get a single product by ID, including its images
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

// Create a new product
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

export const updateProduct = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, description, price, stock_quantity, category, size, color, weight_kg, is_active } = req.body;

  try {
    const existing = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    const result = await pool.query(
      `UPDATE products SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        price = COALESCE($3, price),
        stock_quantity = COALESCE($4, stock_quantity),
        category = COALESCE($5, category),
        size = COALESCE($6, size),
        color = COALESCE($7, color),
        weight_kg = COALESCE($8, weight_kg),
        is_active = COALESCE($9, is_active)
       WHERE id = $10
       RETURNING *`,
      [name, description, price, stock_quantity, category, size, color, weight_kg, is_active, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'UPDATE products SET is_active = FALSE WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const addProductImage = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
  }

  try {
    const productExists = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
    if (productExists.rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    await pool.query(
      'UPDATE product_images SET is_primary = FALSE WHERE product_id = $1',
      [id]
    );

    const result = await pool.query(
      `INSERT INTO product_images (product_id, image_url, is_primary)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, imageUrl, true]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT category, COUNT(*) AS count
       FROM products
       WHERE is_active = TRUE
       GROUP BY category
       ORDER BY category`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};