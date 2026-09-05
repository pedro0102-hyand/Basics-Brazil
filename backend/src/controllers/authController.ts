import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/database';
import { generateAccessToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';
import { sendServerError } from '../middleware/errorHandler';

const userFields = 'id, name, email, role, avatar_url, created_at';

// Register a new user
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Já existe um usuário com esse email.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
      RETURNING id, name, email, role, avatar_url, created_at`,
      [name, email, passwordHash]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    sendServerError(res, error, 'auth.register');
  }
};

// Login an existing user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role });

    res.json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    sendServerError(res, error, 'auth.login');
  }
};

// Get the authenticated user's information
export const me = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT ${userFields} FROM users WHERE id = $1`,
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    sendServerError(res, error, 'auth.me');
  }
};

export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Uma imagem é obrigatória.' });
  }

  try {
    const avatarUrl = `/uploads/${req.file.filename}`;
    const result = await pool.query(
      `UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING ${userFields}`,
      [avatarUrl, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    sendServerError(res, error, 'auth.uploadAvatar');
  }
};