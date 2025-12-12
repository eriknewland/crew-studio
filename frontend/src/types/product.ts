export type Category = 'Clothing' | 'Shoes' | 'Accessories' | 'Electronics';

export interface Product {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: Category;
  price: number;
  availability: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductFilters {
  search?: string;
  categories?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

export interface CreateProductInput {
  title: string;
  description: string;
  image: string;
  category: Category;
  price: number;
  availability: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}
