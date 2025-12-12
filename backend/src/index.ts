import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed.replace(/\/$/, '')))) {
      return callback(null, true);
    }
    // In production, also allow Railway domains
    if (origin.includes('.railway.app')) {
      return callback(null, true);
    }
    callback(null, true); // Allow all for demo purposes
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Product Catalog API is running' });
});

// One-time seed endpoint - remove after seeding
app.get('/api/seed', async (req, res) => {
  try {
    const { Product } = await import('./models/Product');

    const products = [
      { title: 'Sneakers', description: 'Classic white canvas sneakers with rubber sole.', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', category: 'Shoes', price: 49.00, availability: true },
      { title: 'T-Shirt', description: 'Comfortable cotton t-shirt in rust orange.', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', category: 'Clothing', price: 13.00, availability: true },
      { title: 'Headphones', description: 'Premium over-ear wireless headphones with noise cancellation.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', category: 'Electronics', price: 38.00, availability: true },
      { title: 'Smartphone', description: 'Latest flagship smartphone with triple camera system.', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', category: 'Electronics', price: 699.00, availability: true },
      { title: 'Watch', description: 'Minimalist analog watch with black leather strap.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category: 'Accessories', price: 149.00, availability: true },
      { title: 'Bag', description: 'Elegant leather crossbody bag in camel color.', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', category: 'Accessories', price: 89.00, availability: true },
      { title: 'Jeans', description: 'Classic blue denim jeans with comfortable stretch.', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', category: 'Clothing', price: 59.00, availability: true },
      { title: 'Laptop', description: 'Powerful laptop with 15.6" display.', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', category: 'Electronics', price: 999.00, availability: true },
      { title: 'Wireless Earbuds', description: 'High-quality wireless earbuds with noise cancellation.', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', category: 'Electronics', price: 99.99, availability: true },
      { title: 'Running Shoes', description: 'Lightweight running shoes with responsive cushioning.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', category: 'Shoes', price: 129.00, availability: true },
      { title: 'Sunglasses', description: 'Stylish polarized sunglasses with UV protection.', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', category: 'Accessories', price: 75.00, availability: true },
      { title: 'Winter Jacket', description: 'Warm and stylish winter jacket with waterproof outer layer.', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', category: 'Clothing', price: 199.00, availability: false },
    ];

    await Product.deleteMany({});
    for (const p of products) {
      const product = new Product(p);
      await product.save();
    }

    res.json({ status: 'ok', message: `Seeded ${products.length} products` });
  } catch (error) {
    res.status(500).json({ status: 'error', message: String(error) });
  }
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
