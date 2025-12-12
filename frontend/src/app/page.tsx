'use client';

import { useState, useCallback } from 'react';
import { useGetProductsQuery, useCreateProductMutation } from '@/store/api';
import { Sidebar } from '@/components/Sidebar';
import { ProductGrid } from '@/components/ProductGrid';
import { Modal } from '@/components/Modal';
import { ProductForm } from '@/components/ProductForm';
import type { Category, ProductFilters, CreateProductInput } from '@/types/product';
import styles from './page.module.scss';

export default function HomePage() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isFetching } = useGetProductsQuery(filters);
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search: search || undefined }));
  }, []);

  const handleCategoriesChange = useCallback((categories: Category[]) => {
    setFilters((prev) => ({
      ...prev,
      categories: categories.length > 0 ? categories.join(',') : undefined,
    }));
  }, []);

  const handlePriceRangeChange = useCallback(
    (min: number | undefined, max: number | undefined) => {
      setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
    },
    []
  );

  const handleSortChange = useCallback(
    (sort: 'price_asc' | 'price_desc' | undefined) => {
      setFilters((prev) => ({ ...prev, sort }));
    },
    []
  );

  const handleCreateProduct = async (values: CreateProductInput) => {
    await createProduct(values).unwrap();
    setIsModalOpen(false);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <Sidebar
            onSearchChange={handleSearchChange}
            onCategoriesChange={handleCategoriesChange}
            onPriceRangeChange={handlePriceRangeChange}
            onSortChange={handleSortChange}
          />
          <div className={styles.content}>
            <div className={styles.header}>
              <button
                className={`btn btn--primary ${styles.addButton}`}
                onClick={() => setIsModalOpen(true)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add Product
              </button>
            </div>
            <ProductGrid
              products={data?.products || []}
              isLoading={isLoading || isFetching}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Product"
      >
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isCreating}
        />
      </Modal>
    </main>
  );
}
