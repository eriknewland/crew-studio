'use client';

import { useState, useEffect } from 'react';
import type { Category } from '@/types/product';
import styles from './Sidebar.module.scss';

const CATEGORIES: Category[] = ['Clothing', 'Shoes', 'Accessories', 'Electronics'];

interface SidebarProps {
  onSearchChange: (search: string) => void;
  onCategoriesChange: (categories: Category[]) => void;
  onPriceRangeChange: (min: number | undefined, max: number | undefined) => void;
  onSortChange: (sort: 'price_asc' | 'price_desc' | undefined) => void;
  initialSearch?: string;
  initialCategories?: Category[];
  initialMinPrice?: number;
  initialMaxPrice?: number;
  initialSort?: 'price_asc' | 'price_desc';
}

export function Sidebar({
  onSearchChange,
  onCategoriesChange,
  onPriceRangeChange,
  onSortChange,
  initialSearch = '',
  initialCategories = [],
  initialMinPrice,
  initialMaxPrice,
  initialSort,
}: SidebarProps) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(initialCategories);
  const [minPrice, setMinPrice] = useState<string>(initialMinPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState<string>(initialMaxPrice?.toString() || '');
  const [sort, setSort] = useState<string>(initialSort || '');

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearchChange(search);
    }, 300);
    return () => clearTimeout(debounce);
  }, [search, onSearchChange]);

  const handleCategoryChange = (category: Category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    onCategoriesChange(newCategories);
  };

  const handlePriceChange = () => {
    const min = minPrice ? parseFloat(minPrice) : undefined;
    const max = maxPrice ? parseFloat(maxPrice) : undefined;
    onPriceRangeChange(min, max);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    onSortChange(value ? (value as 'price_asc' | 'price_desc') : undefined);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Category</h3>
        <div className={styles.checkboxGroup}>
          {CATEGORIES.map((category) => (
            <label key={category} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className={styles.checkbox}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Price Range</h3>
        <div className={styles.priceInputs}>
          <input
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={handlePriceChange}
            className={styles.priceInput}
            min="0"
          />
          <span className={styles.priceSeparator}>-</span>
          <input
            type="number"
            placeholder="max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={handlePriceChange}
            className={styles.priceInput}
            min="0"
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Sort by Price</h3>
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="">Default</option>
          <option value="price_asc">Low to High</option>
          <option value="price_desc">High to Low</option>
        </select>
      </div>
    </aside>
  );
}
