import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import pool from './config/database';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import shippingRoutes from './routes/shippingRoutes';
import reviewRoutes from './routes/reviewRoutes';
import commentRoutes from './routes/commentRoutes';
import orderRoutes from './routes/orderRoutes';
import { errorHandler, sendServerError } from './middleware/errorHandler';

const app = express();
const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';

app.use(cors({ origin: frontendUrl }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/products/:id/reviews', reviewRoutes);
app.use('/products/:id/comments', commentRoutes);
app.use('/cart', cartRoutes);
app.use('/shipping', shippingRoutes);
app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('API do e-commerce está no ar 🚀');
});

app.get('/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', dbTime: result.rows[0].now });
  } catch (error) {
    sendServerError(res, error, 'health.db');
  }
});

app.use(errorHandler);

export default app;