import { createSlice } from '@reduxjs/toolkit';
import { AppError } from '../../types';

type User = {
  name: string;
  email: string;
  picture?: string;
};

type StateType = {
  currentUser: User | null;
  error: null | AppError;
  loading: boolean;
};

const initialState: StateType = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = {
        ...action.payload.user,
        token: action.payload.accessToken,
      };
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { signInStart, signInFailure, signInSuccess } = userSlice.actions;

export default userSlice.reducer;
