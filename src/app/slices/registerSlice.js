import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as registerServices from '~/services/registerServices';

const initialState = {
    data: {
        userName: '',
        password: '',
        infoUserNew: {},
    },
    status: 'idle',
    errorMessage: '',
};

export const registerUserAsync = createAsyncThunk(
    'register/registerUserAsync',
    async (infoData, { rejectWithValue }) => {
        try {
            const response = await registerServices.postAuthUser(infoData);
            return response;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const registerSlice = createSlice({
    name: 'user/Register',
    initialState,
    reducers: {
        setUserName(state, action) {
            state.data.userName = action.payload;
        },

        setPassword(state, action) {
            state.data.password = action.payload;
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
    },
});

export const { setUserName, setPassword } = registerSlice.actions;

export default registerSlice.reducer;
