import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.error = null;
    },
    clearAuth(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    mergeUser(state, action) {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      state.error = null;
    },
  },
});

export const { setLoading, setError, setUser, clearAuth, mergeUser } =
  authSlice.actions;
export default authSlice.reducer;
