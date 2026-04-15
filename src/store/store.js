import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/es/storage";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    // Memisahkan status loading & error berdasarkan domain
    authStatus: { loading: false, error: null },
    profileStatus: { loading: false, error: null },
  },
  reducers: {
    // Action untuk Auth (Login/Register)
    setAuthLoading(state, action) {
      state.authStatus.loading = action.payload;
    },
    setAuthError(state, action) {
      state.authStatus.error = action.payload;
    },

    // Action untuk Profile (Update/Pin/Password)
    setProfileLoading(state, action) {
      state.profileStatus.loading = action.payload;
    },
    setProfileError(state, action) {
      state.profileStatus.error = action.payload;
    },

    // Set user data secara utuh
    setUser(state, action) {
      state.user = action.payload;
      state.authStatus.error = null;
    },

    // Menggabungkan perubahan profil ke data user yang sudah ada
    mergeUser(state, action) {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      state.profileStatus.error = null;
    },

    clearAuth(state) {
      state.user = null;
      state.authStatus = { loading: false, error: null };
      state.profileStatus = { loading: false, error: null };
    },
  },
});

export const {
  setAuthLoading,
  setAuthError,
  setProfileLoading,
  setProfileError,
  setUser,
  clearAuth,
  mergeUser
} = authSlice.actions;

// Persist hanya di level slice (bukan root),
// agar Redux DevTools bisa membaca actions & state dengan benar
const authPersistConfig = {
  key: "auth",
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice.reducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
