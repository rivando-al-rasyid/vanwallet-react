import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/es/storage";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
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
