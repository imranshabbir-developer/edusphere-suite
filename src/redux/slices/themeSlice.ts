import { createSlice } from "@reduxjs/toolkit";

type Mode = "light" | "dark";

function initial(): Mode {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("theme") as Mode | null;
  if (saved) return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const slice = createSlice({
  name: "theme",
  initialState: { mode: initial() as Mode },
  reducers: {
    toggle(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") localStorage.setItem("theme", state.mode);
    },
    set(state, action: { payload: Mode }) {
      state.mode = action.payload;
      if (typeof window !== "undefined") localStorage.setItem("theme", state.mode);
    },
  },
});

export const { toggle, set } = slice.actions;
export default slice.reducer;
