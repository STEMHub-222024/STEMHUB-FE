import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as ingredientService from '~/services/ingredientServices';

const initialState = {
    data: {
        ingredientAll: [],
        ingredientFilter: [],
    },
    status: 'idle',
    errorMassage: '',
};

export const getIngredientAsync = createAsyncThunk(
    'ingredient/getIngredientAsync',
    async (ingredientData, { rejectWithValue }) => {
        try {
            const response = await ingredientService.getIngredient();
            return response;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const ingredientSlice = createSlice({
    name: 'ingredient',
    initialState,
    reducers: {
        handleFillerIngredient(state, action) {
            state.data.ingredientFilter = action.payload?.ingredientCurrents;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getIngredientAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getIngredientAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.ingredientAll = action.payload;
            })
            .addCase(getIngredientAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMassage = action.payload;
            });
    },
});

export const { handleFillerIngredient } = ingredientSlice.actions;

export default ingredientSlice.reducer;
