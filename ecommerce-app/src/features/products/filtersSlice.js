import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    selectedCategory: 'all',
    minPrice: '',
    maxPrice: '',
    selectedBrands: [],
    currentPage: 1,
    searchQuery: '',
    sortBy: 'featured',
  },
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setSort(state, action) {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },
    setCategory(state, action) {
      state.selectedCategory = action.payload;
      state.currentPage = 1; // reset page on filter change
    },
    setMinPrice(state, action) {
      state.minPrice = action.payload;
      state.currentPage = 1;
    },
    setMaxPrice(state, action) {
      state.maxPrice = action.payload;
      state.currentPage = 1;
    },
    toggleBrand(state, action) {
      const brand = action.payload;
      const idx = state.selectedBrands.indexOf(brand);
      if (idx === -1) {
        state.selectedBrands.push(brand);
      } else {
        state.selectedBrands.splice(idx, 1);
      }
      state.currentPage = 1;
    },
    setPage(state, action) {
      state.currentPage = action.payload;
    },
    setFiltersFromParams(state, action) {
      const { category, minPrice, maxPrice, brands, page, search, sort } = action.payload;
      state.selectedCategory = category || 'all';
      state.minPrice = minPrice || '';
      state.maxPrice = maxPrice || '';
      state.selectedBrands = brands ? (Array.isArray(brands) ? brands : [brands]) : [];
      state.currentPage = page ? Number(page) : 1;
      state.searchQuery = search || '';
      state.sortBy = sort || 'featured';
    },
    resetFilters(state) {
      state.selectedCategory = 'all';
      state.minPrice = '';
      state.maxPrice = '';
      state.selectedBrands = [];
      state.currentPage = 1;
      state.searchQuery = '';
      state.sortBy = 'featured';
    },
  },
});

export const {
  setSearchQuery,
  setSort,
  setCategory,
  setMinPrice,
  setMaxPrice,
  toggleBrand,
  setPage,
  setFiltersFromParams,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
