import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface IProduct extends Document {
  title: string;
  description: string;
  image: string;
  category: 'Clothing' | 'Shoes' | 'Accessories' | 'Electronics';
  price: number;
  availability: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Clothing', 'Shoes', 'Accessories', 'Electronics'],
        message: 'Category must be one of: Clothing, Shoes, Accessories, Electronics',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    availability: {
      type: Boolean,
      required: [true, 'Availability is required'],
      default: true,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.pre('save', async function (next) {
  if (this.isModified('title') || this.isNew) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await mongoose.models.Product.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
