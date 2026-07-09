import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts, getCategories, getProductsByCategory, getAllBrands } from '../../api/productApi';
import { computeAvailableBrands } from '../../utils/filterProducts';

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

// Fetch the brand list from the FULL catalog once (independent of category),
// so the Brand filter is always fully populated.
export const fetchAllBrands = createAsyncThunk(
  'products/fetchAllBrands',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllBrands();
      return computeAvailableBrands(data.products);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch brands');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    allProducts: [],
    categories: [],
    allBrands: [],
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
      })
      .addCase(fetchAllBrands.fulfilled, (state, action) => {
        state.allBrands = action.payload;
      });
  },
});

export default productsSlice.reducer;
