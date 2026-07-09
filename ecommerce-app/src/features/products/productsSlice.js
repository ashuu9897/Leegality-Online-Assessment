import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts, getCategories, getProductsByCategory } from '../../api/productApi';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (category, { rejectWithValue }) => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        category && category !== 'all'
          ? getProductsByCategory(category)
          : getProducts(),
        getCategories(),
      ]);
      return {
        products: productsData.products,
        categories: categoriesData,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch products');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    allProducts: [],
    categories: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allProducts = action.payload.products;
        state.categories = action.payload.categories;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
