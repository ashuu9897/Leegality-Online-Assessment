import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    filtersDrawerOpen: false, // mobile/tablet drawer
    desktopSidebarOpen: true, // persistent desktop sidebar (collapsible)
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
    toggleDesktopSidebar(state) {
      state.desktopSidebarOpen = !state.desktopSidebarOpen;
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
  toggleDesktopSidebar,
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
} = uiSlice.actions;
export default uiSlice.reducer;
