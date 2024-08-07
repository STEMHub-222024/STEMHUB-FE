import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as userService from '~/services/userServices';

const initialState = {
    data: {
        token: '',
        email: '',
        password: '',
        confirmPassword: '',
        infoReset: {},
        loading: false,
        userInfo: {},
    },
    status: 'idle',
    errorMessage: '',
};

export const getUserIdAsync = createAsyncThunk('user/getUserIdAsync', async (infoData, { rejectWithValue }) => {
    try {
        const response = await userService.getUserId(infoData);
        return response;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const optEmailAsync = createAsyncThunk('user/optEmailAsync', async (infoData, { rejectWithValue }) => {
    try {
        const response = await userService.optEmail(infoData);
        return response;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const resetPasswordAsync = createAsyncThunk('user/resetPasswordAsync', async (infoData, { rejectWithValue }) => {
    try {
        const response = await userService.resetPassword(infoData);
        return response;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const putUserIdAsync = createAsyncThunk('user/putUserIdAsync', async (infoData, { rejectWithValue }) => {
    try {
        const response = await userService.putUserById(infoData);
        return response;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setToken(state, action) {
            state.data.token = action.payload;
        },
        setEmailUser(state, action) {
            state.data.email = action.payload;
        },
        setPasswordUser(state, action) {
            state.data.password = action.payload;
        },
        setConfirmPassword(state, action) {
            state.data.confirmPassword = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(optEmailAsync.pending, (state) => {
                state.status = 'loading';
                state.data.loading = true;
            })
            .addCase(optEmailAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.infoReset = action.payload;
                state.data.loading = false;
            })
            .addCase(optEmailAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
                state.data.loading = false;
            });
        builder
            .addCase(resetPasswordAsync.pending, (state) => {
                state.status = 'loading';
                state.data.loading = true;
            })
            .addCase(resetPasswordAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.infoReset = action.payload;
                state.data.loading = false;
            })
            .addCase(resetPasswordAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
                state.data.loading = false;
            });
        builder
            .addCase(getUserIdAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUserIdAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.userInfo = action.payload;
            })
            .addCase(getUserIdAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
        builder
            .addCase(putUserIdAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(putUserIdAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.userInfo = action.payload;
            })
            .addCase(putUserIdAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
    },
});

export const { setToken, setEmailUser, setPasswordUser, setConfirmPassword } = userSlice.actions;

export default userSlice.reducer;
