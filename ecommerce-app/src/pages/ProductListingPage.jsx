import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useProducts, useFilterMeta } from '../hooks/useProducts';
import { useQueryParams } from '../hooks/useQueryParams';
import { fetchProducts } from '../features/products/productsSlice';
import { setPage, setSort } from '../features/products/filtersSlice';
import FilterPanel from '../components/filters/FilterPanel';
import ProductGrid from '../components/product/ProductGrid';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import Pagination from '../components/common/Pagination';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'discount', label: 'Biggest Discount' },
];

export default function ProductListingPage() {
  useQueryParams();
  const dispatch = useDispatch();
  const { categories, availableBrands } = useFilterMeta();
  const sidebarOpen = useSelector((state) => state.ui.desktopSidebarOpen);

  const {
    products,
    filteredCount,
    totalPages,
    status,
    error,
    filters,
  } = useProducts();

  const handleRetry = () => dispatch(fetchProducts(filters.selectedCategory));

  // Restore listing scroll position when returning from a product detail page.
  const restored = useRef(false);
  useEffect(() => {
    const onScroll = () => sessionStorage.setItem('listingScrollY', String(window.scrollY));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (status === 'succeeded' && !restored.current) {
      restored.current = true;
      const y = sessionStorage.getItem('listingScrollY');
      if (y) requestAnimationFrame(() => window.scrollTo(0, parseInt(y, 10)));
    }
  }, [status]);

  const categoryLabel =
    filters.selectedCategory && filters.selectedCategory !== 'all'
      ? filters.selectedCategory.replace(/-/g, ' ')
      : 'All products';

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <div className="flex gap-6 items-start">
        {/* Persistent sidebar (desktop only) — collapsible via the navbar hamburger */}
        {sidebarOpen && (
          <aside className="hidden lg:block w-72 shrink-0 bg-white rounded-lg border border-gray-200 self-start sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto">
            <FilterPanel categories={categories} brands={availableBrands} />
          </aside>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header: title + sort */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3 mb-5">
            <div>
              <h1 className="text-lg font-bold text-gray-900 capitalize">
                {filters.searchQuery ? `Results for "${filters.searchQuery}"` : categoryLabel}
              </h1>
              {status === 'succeeded' && (
                <p className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-800">{filteredCount}</span> result{filteredCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <span className="hidden sm:inline">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => dispatch(setSort(e.target.value))}
                className="border border-gray-300 rounded-md px-2.5 py-1.5 text-sm bg-white outline-none focus:border-blue-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
          </div>

          {status === 'loading' && <Loader count={12} />}
          {status === 'failed' && <ErrorMessage message={error} onRetry={handleRetry} />}
          {status === 'succeeded' && <ProductGrid products={products} />}

          {status === 'succeeded' && (
            <Pagination
              currentPage={filters.currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                dispatch(setPage(page));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
