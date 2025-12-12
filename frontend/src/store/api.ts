import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Product,
  ProductsResponse,
  ProductFilters,
  CreateProductInput,
  UpdateProductInput,
} from '@/types/product';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
console.log('API URL:', baseUrl);

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Product', 'Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.categories) params.append('categories', filters.categories);
        if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
        if (filters.sort) params.append('sort', filters.sort);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        return `/products?${params.toString()}`;
      },
      providesTags: ['Products'],
    }),
    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `/products/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Product', id: slug }],
    }),
    getRelatedProducts: builder.query<Product[], string>({
      query: (slug) => `/products/${slug}/related`,
    }),
    createProduct: builder.mutation<Product, CreateProductInput>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation<Product, { slug: string; data: UpdateProductInput }>({
      query: ({ slug, data }) => ({
        url: `/products/${slug}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { slug }) => [
        'Products',
        { type: 'Product', id: slug },
      ],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (slug) => ({
        url: `/products/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
    generateSlug: builder.mutation<{ slug: string }, string>({
      query: (title) => ({
        url: '/products/generate-slug',
        method: 'POST',
        body: { title },
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetRelatedProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGenerateSlugMutation,
} = productApi;
