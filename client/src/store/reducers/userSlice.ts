import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';
interface UserState {
  data: null | {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: UserState = {
  data: null,
  loading: 'idle',
};

export const register = createAsyncThunk(
  'user/register',
  async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await axios.post('/api/users/register', {
      name,
      email,
      password,
    });
    return response.data;
  }
);

export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post('/api/users/login', { email, password });
    return response.data;
  }
);

export const checkAuthorization = createAsyncThunk(
  'user/checkAuthorization',
  async () => {
    const response = await axios.get('/api/users/check_auth');
    return response.data;
  }
);

const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.loading = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state, action) => {
      state.data = null;
      state.loading = 'pending';
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = 'succeeded';
    });
    builder.addCase(register.rejected, (state, action) => {
      state.data = null;
      state.loading = 'failed';
    });
    builder.addCase(login.pending, (state, action) => {
      state.data = null;
      state.loading = 'pending';
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = 'succeeded';
    });
    builder.addCase(login.rejected, (state, action) => {
      state.data = null;
      state.loading = 'failed';
    });
    builder.addCase(checkAuthorization.pending, (state, action) => {
      state.data = null;
      state.loading = 'pending';
    });
    builder.addCase(checkAuthorization.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = 'succeeded';
    });
    builder.addCase(checkAuthorization.rejected, (state, action) => {
      state.data = null;
      state.loading = 'failed';
    });
  },
});

export const { logout } = userReducer.actions;

export default userReducer.reducer;
