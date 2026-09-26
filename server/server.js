import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { initFirebaseAdmin } from './config/firebase.js';
import healthRoutes from './routes/healthRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { seedProductsDB } from './utils/seedData.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Initialize Firebase Admin
initFirebaseAdmin();

// Middleware to ensure DB connection on serverless requests
app.use(async (req, res, next) => {
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
    } catch (dbErr) {
      console.error('[DB Middleware Error]:', dbErr.message);
    }
  }
  next();
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Centralized Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas and launch server (only if not on Vercel)
if (!process.env.VERCEL) {
  const startServer = async () => {
    if (process.env.MONGODB_URI) {
      await connectDB();
      await seedProductsDB();
    } else {
      console.warn('[Server Warning] MONGODB_URI environment variable not set. Server starting without DB connection.');
    }

    app.listen(PORT, () => {
      console.log(`[GreenBasket Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  };

  startServer();
}

export default app;
