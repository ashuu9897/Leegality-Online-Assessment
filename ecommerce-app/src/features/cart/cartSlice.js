import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // { id, title, price, thumbnail, qty }
  },
  reducers: {
    addToCart(state, action) {
      const { quantity = 1, ...product } = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        existing.qty += quantity;
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          discountPercentage: product.discountPercentage || 0,
          thumbnail: product.thumbnail || product.images?.[0],
          qty: quantity,
        });
      }
    },
    incrementQty(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.qty += 1;
    },
    decrementQty(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.qty -= 1;
        if (item.qty <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, incrementQty, decrementQty, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
