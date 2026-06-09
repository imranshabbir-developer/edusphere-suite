import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "ui",
  initialState: { sidebarCollapsed: false, mobileNavOpen: false },
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setMobileNav(state, action: { payload: boolean }) {
      state.mobileNavOpen = action.payload;
    },
  },
});

export const { toggleSidebar, setMobileNav } = slice.actions;
export default slice.reducer;
