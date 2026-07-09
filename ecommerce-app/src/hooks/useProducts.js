import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productsSlice';
import {
  filterProducts,
  paginateProducts,
  sortProducts,
  computeAvailableBrands,
} from '../utils/filterProducts';
import { PRODUCTS_PER_PAGE } from '../utils/constants';

/**
 * Pure selector hook for the filter panels (safe to call from multiple
 * components). The one-time full-catalog brand fetch is dispatched in AppShell.
 */
export function useFilterMeta() {
  const { allProducts, categories, allBrands } = useSelector((state) => state.products);

  // Prefer the full-catalog brand list; fall back to whatever is loaded.
  const availableBrands = useMemo(
    () => (allBrands.length ? allBrands : computeAvailableBrands(allProducts)),
    [allBrands, allProducts]
  );

  return { categories, availableBrands };
}

export function useProducts() {
  const dispatch = useDispatch();
  const { allProducts, categories, status, error } = useSelector((state) => state.products);
  const filters = useSelector((state) => state.filters);
  const { selectedCategory, minPrice, maxPrice, selectedBrands, currentPage, searchQuery, sortBy } = filters;

  // Fetch products when category changes
  useEffect(() => {
    dispatch(fetchProducts(selectedCategory));
  }, [dispatch, selectedCategory]);

  // Client-side filter (price + brand + search)
  const filteredProducts = useMemo(
    () => filterProducts(allProducts, { minPrice, maxPrice, selectedBrands, searchQuery }),
    [allProducts, minPrice, maxPrice, selectedBrands, searchQuery]
  );

  // Client-side sort
  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, sortBy),
    [filteredProducts, sortBy]
  );

  // Client-side pagination
  const paginatedProducts = useMemo(
    () => paginateProducts(sortedProducts, currentPage, PRODUCTS_PER_PAGE),
    [sortedProducts, currentPage]
  );

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);

  return {
    products: paginatedProducts,
    filteredCount: sortedProducts.length,
    totalPages,
    categories,
    status,
    error,
    filters,
  };
}
