import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  saveAuthSession,
} from '../../services/authClient';

export interface User {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const storedUser = getStoredUser();
const storedAccessToken = getAccessToken();

const initialState: AuthState = {
  user: storedUser,
  token: storedAccessToken,
  accessToken: storedAccessToken,
  isAuthenticated: !!storedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken?: string; token?: string }>
    ) => {
      const token = action.payload.accessToken || action.payload.token || null;

      state.user = action.payload.user;
      state.token = token;
      state.accessToken = token;
      state.isAuthenticated = !!token;

      if (token) {
        saveAuthSession({ user: action.payload.user, accessToken: token });
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      clearAuthSession();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
