import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Role = "admin" | "teacher" | "faculty" | "student";

export interface User {
  email: string;
  name: string;
  role: Role;
  avatar: string;
}

interface AuthState {
  user: User | null;
}

const ROLE_MAP: Record<string, { role: Role; name: string }> = {
  "admin@test.com": { role: "admin", name: "Alex Morgan" },
  "teacher@test.com": { role: "teacher", name: "Priya Sharma" },
  "faculty@test.com": { role: "faculty", name: "Daniel Reyes" },
  "student@test.com": { role: "student", name: "Maya Chen" },
};

function load(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("auth_user");
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

const initialState: AuthState = { user: load() };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      const email = action.payload.trim().toLowerCase();
      const meta = ROLE_MAP[email];
      if (!meta) return;
      const user: User = {
        email,
        name: meta.name,
        role: meta.role,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(meta.name)}`,
      };
      state.user = user;
      if (typeof window !== "undefined") localStorage.setItem("auth_user", JSON.stringify(user));
    },
    logout(state) {
      state.user = null;
      if (typeof window !== "undefined") localStorage.removeItem("auth_user");
    },
  },
});

export const { login, logout } = slice.actions;
export const VALID_EMAILS = Object.keys(ROLE_MAP);
export default slice.reducer;
