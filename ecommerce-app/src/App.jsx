import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";
import Navbar from "./components/layout/Navbar";
import CartDrawer from "./components/layout/CartDrawer";
import FilterSidebar from "./components/filters/FilterSidebar";
import Loader from "./components/common/Loader";
import { useFilterMeta } from "./hooks/useProducts";

const ProductListingPage = lazy(() => import("./pages/ProductListingPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));

function AppShell() {
  const { categories, availableBrands } = useFilterMeta();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <CartDrawer />
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
