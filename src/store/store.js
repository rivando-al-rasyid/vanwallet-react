import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE
} from "redux-persist";
import storage from "redux-persist/es/storage";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
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
      // spread operator
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


const authPersistConfig = {
  key: "auth",
  storage,
};

const authReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice.reducer),
});

export const store = configureStore({
  reducer: authReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                    REHYDRATE
                ]
            }
    }),
});

export const persistor = persistStore(store);
