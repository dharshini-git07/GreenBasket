import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { initFirebaseAdmin } from './config/firebase.js';
import healthRoutes from './routes/healthRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import { seedProductsDB } from './utils/seedData.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Initialize Firebase Admin
initFirebaseAdmin();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Centralized Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas and launch server
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
