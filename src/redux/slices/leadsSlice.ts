import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { leads as seed, type Lead } from "@/mockData/leads";

interface State { items: Lead[] }
const slice = createSlice({
  name: "leads",
  initialState: { items: seed } as State,
  reducers: {
    addLead(state, action: PayloadAction<Lead>) { state.items.unshift(action.payload); },
    updateLead(state, action: PayloadAction<Lead>) {
      const i = state.items.findIndex((l) => l.id === action.payload.id);
      if (i >= 0) state.items[i] = action.payload;
    },
    removeLead(state, action: PayloadAction<string>) {
      state.items = state.items.filter((l) => l.id !== action.payload);
    },
    moveStage(state, action: PayloadAction<{ id: string; stage: Lead["stage"] }>) {
      const l = state.items.find((x) => x.id === action.payload.id);
      if (l) l.stage = action.payload.stage;
    },
  },
});
export const { addLead, updateLead, removeLead, moveStage } = slice.actions;
export default slice.reducer;
