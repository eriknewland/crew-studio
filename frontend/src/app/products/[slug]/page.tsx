'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  useGetProductBySlugQuery,
  useGetRelatedProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '@/store/api';
import { ProductCard } from '@/components/ProductCard';
import { Modal } from '@/components/Modal';
import { ProductForm } from '@/components/ProductForm';
import type { CreateProductInput } from '@/types/product';
import styles from './page.module.scss';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { data: product, isLoading, error } = useGetProductBySlugQuery(slug);
  const { data: relatedProducts } = useGetRelatedProductsQuery(slug, {
    skip: !product,
  });
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleUpdate = async (values: CreateProductInput) => {
    await updateProduct({ slug, data: values }).unwrap();
    setIsEditModalOpen(false);
  };

  const handleDelete = async () => {
    await deleteProduct(slug).unwrap();
    router.push('/');
  };

  if (isLoading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.skeleton}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonPrice} />
              <div className={styles.skeletonDescription} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.error}>
            <h1>Product not found</h1>
            <Link href="/" className="btn btn--primary">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{product.category}</span>
        </nav>

        <div className={styles.product}>
          <div className={styles.imageWrapper}>
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
              priority
            />
          </div>

          <div className={styles.details}>
            <h1 className={styles.title}>{product.title}</h1>

            <div className={styles.priceRow}>
              <span className={styles.price}>${product.price.toFixed(2)}</span>
              <span
                className={`badge ${
                  product.availability ? 'badge--success' : 'badge--error'
                }`}
              >
                {product.availability ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className={styles.description}>
              <h2>Description</h2>
              <p>{product.description}</p>
            </div>

            <div className={styles.actions}>
              <button
                className="btn btn--secondary"
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Product
              </button>
              <button
                className="btn btn--danger"
                onClick={() => setIsDeleteConfirmOpen(true)}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>

        {relatedProducts && relatedProducts.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>Related Products</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Product"
      >
        <ProductForm
          initialValues={product}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditModalOpen(false)}
          isSubmitting={isUpdating}
        />
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete Product"
      >
        <div className={styles.deleteConfirm}>
          <p>Are you sure you want to delete "{product.title}"?</p>
          <p className={styles.deleteWarning}>This action cannot be undone.</p>
          <div className={styles.deleteActions}>
            <button
              className="btn btn--secondary"
              onClick={() => setIsDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className="btn btn--danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
