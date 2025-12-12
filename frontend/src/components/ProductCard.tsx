'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/product';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.price}>${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
