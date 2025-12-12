import { Request, Response } from 'express';
import { Product, IProduct } from '../models/Product';
import slugify from 'slugify';

interface ProductQuery {
  title?: { $regex: string; $options: string };
  category?: { $in: string[] };
  price?: { $gte?: number; $lte?: number };
}

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      categories,
      minPrice,
      maxPrice,
      sort,
      page = '1',
      limit = '12',
    } = req.query;

    const query: ProductQuery = {};

    if (search && typeof search === 'string') {
      query.title = { $regex: search, $options: 'i' };
    }

    if (categories && typeof categories === 'string') {
      const categoryArray = categories.split(',');
      query.category = { $in: categoryArray };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption: { [key: string]: 1 | -1 } = { title: 1 };
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

export const getRelatedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.json(relatedProducts);
  } catch (error) {
    console.error('Error fetching related products:', error);
    res.status(500).json({ message: 'Error fetching related products' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, image, category, price, availability } = req.body;

    const product = new Product({
      title,
      description,
      image,
      category,
      price,
      availability,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error creating product' });
    }
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const { title, description, image, category, price, availability } = req.body;

    const product = await Product.findOne({ slug });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (image !== undefined) product.image = image;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = price;
    if (availability !== undefined) product.availability = availability;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error updating product' });
    }
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await Product.findOneAndDelete({ slug });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

export const generateSlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;

    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    let baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    res.json({ slug });
  } catch (error) {
    console.error('Error generating slug:', error);
    res.status(500).json({ message: 'Error generating slug' });
  }
};
