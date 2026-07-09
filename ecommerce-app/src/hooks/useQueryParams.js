import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFiltersFromParams } from '../features/products/filtersSlice';

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  const initialized = useRef(false);

  // On mount: hydrate Redux from URL
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(
        setFiltersFromParams({
          category: searchParams.get('category'),
          minPrice: searchParams.get('minPrice'),
          maxPrice: searchParams.get('maxPrice'),
          brands: searchParams.getAll('brand'),
          page: searchParams.get('page'),
          search: searchParams.get('q'),
          sort: searchParams.get('sort'),
        })
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // On filter change: sync Redux state back to URL
  useEffect(() => {
    if (!initialized.current) return;
    const params = {};
    if (filters.selectedCategory && filters.selectedCategory !== 'all') {
      params.category = filters.selectedCategory;
    }
    if (filters.minPrice !== '') params.minPrice = filters.minPrice;
    if (filters.maxPrice !== '') params.maxPrice = filters.maxPrice;
    if (filters.currentPage > 1) params.page = filters.currentPage;
    if (filters.searchQuery) params.q = filters.searchQuery;
    if (filters.sortBy && filters.sortBy !== 'featured') params.sort = filters.sortBy;

    const newParams = new URLSearchParams(params);
    filters.selectedBrands.forEach((b) => newParams.append('brand', b));
    setSearchParams(newParams, { replace: true });
  }, [
    filters.selectedCategory,
    filters.minPrice,
    filters.maxPrice,
    filters.selectedBrands,
    filters.currentPage,
    filters.searchQuery,
    filters.sortBy,
  ]); // eslint-disable-line react-hooks/exhaustive-deps
}
