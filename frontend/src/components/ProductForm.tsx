'use client';

import { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { Category, Product, CreateProductInput } from '@/types/product';
import { useGenerateSlugMutation } from '@/store/api';
import styles from './ProductForm.module.scss';

const CATEGORIES: Category[] = ['Clothing', 'Shoes', 'Accessories', 'Electronics'];

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .max(200, 'Title cannot exceed 200 characters'),
  image: Yup.string()
    .required('Image URL is required')
    .url('Must be a valid URL'),
  category: Yup.string()
    .required('Category is required')
    .oneOf(CATEGORIES, 'Invalid category'),
  price: Yup.number()
    .required('Price is required')
    .min(0, 'Price cannot be negative'),
  availability: Yup.boolean().required('Availability is required'),
  description: Yup.string().required('Description is required'),
});

interface ProductFormProps {
  initialValues?: Product;
  onSubmit: (values: CreateProductInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ProductForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProductFormProps) {
  const [generateSlug, { data: slugData }] = useGenerateSlugMutation();

  const defaultValues: CreateProductInput & { slug: string } = {
    title: initialValues?.title || '',
    image: initialValues?.image || '',
    category: initialValues?.category || 'Clothing',
    price: initialValues?.price || 0,
    availability: initialValues?.availability ?? true,
    description: initialValues?.description || '',
    slug: initialValues?.slug || '',
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        const { slug, ...submitValues } = values;
        await onSubmit(submitValues);
      }}
    >
      {({ values, setFieldValue, errors, touched }) => {
        useEffect(() => {
          if (values.title && !initialValues) {
            const debounce = setTimeout(() => {
              generateSlug(values.title);
            }, 500);
            return () => clearTimeout(debounce);
          }
        }, [values.title]);

        useEffect(() => {
          if (slugData?.slug && !initialValues) {
            setFieldValue('slug', slugData.slug);
          }
        }, [slugData, setFieldValue]);

        return (
          <Form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Title</label>
              <Field
                type="text"
                id="title"
                name="title"
                className={errors.title && touched.title ? styles.error : ''}
              />
              <ErrorMessage name="title" component="span" className={styles.errorMessage} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="slug">Slug</label>
              <Field
                type="text"
                id="slug"
                name="slug"
                readOnly
                className={styles.readOnly}
                placeholder="Auto-generated from title"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="image">Image URL</label>
              <Field
                type="text"
                id="image"
                name="image"
                placeholder="https://example.com/image.jpg"
                className={errors.image && touched.image ? styles.error : ''}
              />
              <ErrorMessage name="image" component="span" className={styles.errorMessage} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Category</label>
              <Field
                as="select"
                id="category"
                name="category"
                className={errors.category && touched.category ? styles.error : ''}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="category" component="span" className={styles.errorMessage} />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="price">Price ($)</label>
                <Field
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  className={errors.price && touched.price ? styles.error : ''}
                />
                <ErrorMessage name="price" component="span" className={styles.errorMessage} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="availability">Availability</label>
                <Field
                  as="select"
                  id="availability"
                  name="availability"
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </Field>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows={4}
                className={errors.description && touched.description ? styles.error : ''}
              />
              <ErrorMessage name="description" component="span" className={styles.errorMessage} />
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                onClick={onCancel}
                className={`btn btn--secondary ${styles.cancelButton}`}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn--primary ${styles.submitButton}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : initialValues ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
