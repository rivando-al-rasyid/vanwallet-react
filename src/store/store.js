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

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
