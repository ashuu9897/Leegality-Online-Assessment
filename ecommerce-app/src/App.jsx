import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from './app/store';
import Navbar from './components/layout/Navbar';
import CartDrawer from './components/layout/CartDrawer';
import FilterSidebar from './components/filters/FilterSidebar';
import Loader from './components/common/Loader';
import { useFilterMeta } from './hooks/useProducts';
import { fetchAllBrands } from './features/products/productsSlice';

// Route-level code splitting for a smaller initial bundle
const ProductListingPage = lazy(() => import('./pages/ProductListingPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));

function AppShell() {
  const dispatch = useDispatch();
  const { categories, availableBrands } = useFilterMeta();

  // Load the full-catalog brand list once, so the Brand filter is complete.
  useEffect(() => {
    dispatch(fetchAllBrands());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <CartDrawer />
      {/* Mobile/tablet drawer (hidden on lg+, where the listing shows a persistent sidebar) */}
      <FilterSidebar categories={categories} brands={availableBrands} />

      <div className="flex-1">
        <Suspense
          fallback={
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Loader count={12} />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<ProductListingPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </Provider>
  );
}
