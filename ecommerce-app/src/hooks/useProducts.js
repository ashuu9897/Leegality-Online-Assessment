import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productsSlice";
import {
  filterProducts,
  paginateProducts,
  sortProducts,
  computeAvailableBrands,
} from "../utils/filterProducts";
import { PRODUCTS_PER_PAGE } from "../utils/constants";

export function useFilterMeta() {
  const { allProducts, categories } = useSelector((state) => state.products);
  const { minPrice, maxPrice, searchQuery, selectedGenders } = useSelector(
    (state) => state.filters,
  );

  const availableBrands = useMemo(
    () =>
      computeAvailableBrands(
        filterProducts(allProducts, {
          minPrice,
          maxPrice,
          searchQuery,
          selectedGenders,
          selectedBrands: [],
        }),
      ),
    [allProducts, minPrice, maxPrice, searchQuery, selectedGenders],
  );

  return { categories, availableBrands };
}

export function useProducts() {
  const dispatch = useDispatch();
  const { allProducts, categories, status, error } = useSelector(
    (state) => state.products,
  );
  const filters = useSelector((state) => state.filters);
  const {
    selectedCategory,
    minPrice,
    maxPrice,
    selectedBrands,
    selectedGenders,
    currentPage,
    searchQuery,
    sortBy,
  } = filters;

  useEffect(() => {
    dispatch(fetchProducts(selectedCategory));
  }, [dispatch, selectedCategory]);

  const filteredProducts = useMemo(
    () =>
      filterProducts(allProducts, {
        minPrice,
        maxPrice,
        selectedBrands,
        selectedGenders,
        searchQuery,
      }),
    [
      allProducts,
      minPrice,
      maxPrice,
      selectedBrands,
      selectedGenders,
      searchQuery,
    ],
  );

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, sortBy),
    [filteredProducts, sortBy],
  );

  const paginatedProducts = useMemo(
    () => paginateProducts(sortedProducts, currentPage, PRODUCTS_PER_PAGE),
    [sortedProducts, currentPage],
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
