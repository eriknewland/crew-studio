import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product';

dotenv.config();

const products = [
  {
    title: 'Sneakers',
    description: 'Classic white canvas sneakers with rubber sole. Perfect for everyday casual wear.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    category: 'Shoes',
    price: 49.00,
    availability: true,
  },
  {
    title: 'T-Shirt',
    description: 'Comfortable cotton t-shirt in rust orange. Relaxed fit suitable for all occasions.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    category: 'Clothing',
    price: 13.00,
    availability: true,
  },
  {
    title: 'Headphones',
    description: 'Premium over-ear wireless headphones with active noise cancellation and 30-hour battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'Electronics',
    price: 38.00,
    availability: true,
  },
  {
    title: 'Smartphone',
    description: 'Latest flagship smartphone with triple camera system and all-day battery life.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    category: 'Electronics',
    price: 699.00,
    availability: true,
  },
  {
    title: 'Watch',
    description: 'Minimalist analog watch with black leather strap and stainless steel case.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    category: 'Accessories',
    price: 149.00,
    availability: true,
  },
  {
    title: 'Bag',
    description: 'Elegant leather crossbody bag in camel color. Perfect for daily essentials.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    category: 'Accessories',
    price: 89.00,
    availability: true,
  },
  {
    title: 'Jeans',
    description: 'Classic blue denim jeans with comfortable stretch. Timeless style for any wardrobe.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    category: 'Clothing',
    price: 59.00,
    availability: true,
  },
  {
    title: 'Laptop',
    description: 'Powerful laptop with 15.6" display, perfect for work and entertainment.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    category: 'Electronics',
    price: 999.00,
    availability: true,
  },
  {
    title: 'Wireless Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation and long battery life.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    category: 'Electronics',
    price: 99.99,
    availability: true,
  },
  {
    title: 'Running Shoes',
    description: 'Lightweight running shoes with responsive cushioning for maximum comfort.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    category: 'Shoes',
    price: 129.00,
    availability: true,
  },
  {
    title: 'Sunglasses',
    description: 'Stylish polarized sunglasses with UV protection.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    category: 'Accessories',
    price: 75.00,
    availability: true,
  },
  {
    title: 'Winter Jacket',
    description: 'Warm and stylish winter jacket with waterproof outer layer.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    category: 'Clothing',
    price: 199.00,
    availability: false,
  },
];

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/product-catalog';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
      console.log(`Created product: ${product.title} (${product.slug})`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
