import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    filtersDrawerOpen: false,
    cartDrawerOpen: false,
  },
  reducers: {
    openFiltersDrawer(state) {
      state.filtersDrawerOpen = true;
    },
    closeFiltersDrawer(state) {
      state.filtersDrawerOpen = false;
    },
    toggleFiltersDrawer(state) {
      state.filtersDrawerOpen = !state.filtersDrawerOpen;
    },
    openCartDrawer(state) {
      state.cartDrawerOpen = true;
    },
    closeCartDrawer(state) {
      state.cartDrawerOpen = false;
    },
    toggleCartDrawer(state) {
      state.cartDrawerOpen = !state.cartDrawerOpen;
    },
  },
});

export const {
  openFiltersDrawer,
  closeFiltersDrawer,
  toggleFiltersDrawer,
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
} = uiSlice.actions;
export default uiSlice.reducer;
