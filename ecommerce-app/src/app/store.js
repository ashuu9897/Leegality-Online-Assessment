import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import filtersReducer from '../features/products/filtersSlice';
import cartReducer from '../features/cart/cartSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import uiReducer from '../features/ui/uiSlice';
import { loadState, saveState } from '../utils/storage';

const CART_KEY = 'shopzone_cart';
const WISHLIST_KEY = 'shopzone_wishlist';

const store = configureStore({
  reducer: {
    products: productsReducer,
    filters: filtersReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
  },
  // Rehydrate cart + wishlist from localStorage on startup
  preloadedState: {
    cart: { items: loadState(CART_KEY, []) },
    wishlist: { ids: loadState(WISHLIST_KEY, []) },
  },
});

// Persist cart + wishlist whenever they change (only these slices)
let prevCart = store.getState().cart.items;
let prevWishlist = store.getState().wishlist.ids;
store.subscribe(() => {
  const { cart, wishlist } = store.getState();
  if (cart.items !== prevCart) {
    prevCart = cart.items;
    saveState(CART_KEY, cart.items);
  }
  if (wishlist.ids !== prevWishlist) {
    prevWishlist = wishlist.ids;
    saveState(WISHLIST_KEY, wishlist.ids);
  }
});

export default store;
