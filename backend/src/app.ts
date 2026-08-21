import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import pool from './config/database';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';

// Create an instance of the Express application
const app = express();

app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('API do e-commerce está no ar 🚀');
});


// Health check endpoint for database connection
app.get('/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', dbTime: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
});

export default app;