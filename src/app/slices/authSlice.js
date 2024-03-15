import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as AuthServices from '~/services/authServices';

const initialState = {
    data: {
        userName: '',
        password: '',
        email: '',
        infoUserNew: {},
        loading: false,
    },
    status: 'idle',
    errorMessage: '',
};

export const registerUserAsync = createAsyncThunk('auth/registerUserAsync', async (infoData, { rejectWithValue }) => {
    try {
        const response = await AuthServices.postAuthUser(infoData);
        return response;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const loginUserAsync = createAsyncThunk('auth/loginUserAsync', async (infoData, { rejectWithValue }) => {
    try {
        const response = await AuthServices.loginAuthUser(infoData);
        return response;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserName(state, action) {
            state.data.userName = action.payload;
        },

        setPassword(state, action) {
            state.data.password = action.payload;
        },
        setEmail(state, action) {
            state.data.email = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUserAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUserAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.infoUserNew = action.payload;
                state.data.userName = '';
                state.data.password = '';
            })
            .addCase(registerUserAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
        builder
            .addCase(loginUserAsync.pending, (state) => {
                state.status = 'loading';
                state.data.loading = true;
            })
            .addCase(loginUserAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.infoUserNew = action.payload;
                state.data.loading = false;
            })
            .addCase(loginUserAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
                state.data.loading = false;
            });
    },
});

export const { setUserName, setPassword, setEmail } = authSlice.actions;

export default authSlice.reducer;
