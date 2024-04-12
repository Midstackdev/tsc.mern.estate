import { createSlice } from '@reduxjs/toolkit';
import { AppError } from '../../types';

type StateType = {
  currentUser: object | null;
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
      state.currentUser = action.payload;
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
