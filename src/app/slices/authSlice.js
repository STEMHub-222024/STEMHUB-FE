import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as AuthServices from '~/services/authServices';
import Cookies from 'js-cookie';

const initialState = {
    data: {
        userName: '',
        password: '',
        email: '',
        infoUserNew: {},
        infoUserCurrent: {},
        loading: false,
        dataNewToken: {},
        allow: false,
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

export const getUserCurrentAsync = createAsyncThunk('auth/getUserCurrent', async (infoData, { rejectWithValue }) => {
    try {
        const response = await AuthServices.getUserCurrent(infoData);
        return response;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const refreshTokenAsync = createAsyncThunk('auth/refreshTokenAsync', async (infoData, { rejectWithValue }) => {
    try {
        const response = await AuthServices.refreshToken(infoData);
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
        setAllow(state, action) {
            state.data.allow = action.payload;
        },
        logout: (state) => {
            state.data.allow = false;
            state.data.infoUserCurrent = {};
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('saveRefreshToken');
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
        builder
            .addCase(getUserCurrentAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUserCurrentAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.infoUserCurrent = action.payload;
                state.data.allow = true;
            })
            .addCase(getUserCurrentAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
                state.data.allow = false;
            });
        builder
            .addCase(refreshTokenAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(refreshTokenAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.dataNewToken = action.payload;
            })
            .addCase(refreshTokenAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
    },
});

export const { setUserName, setPassword, setEmail, setAllow, logout } = authSlice.actions;

export default authSlice.reducer;
