import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as stemServices from '~/services/stemServices';

const initialState = {
    navbarTopicData: [],
    isOnClickStem: '',
    status: 'idle',
    errorMessage: '',
};

// action creator thunk
export const getStemAsync = createAsyncThunk('navbarTopic/getStemAsync', async (data, { rejectWithValue }) => {
    try {
        const response = await stemServices.getStem();
        return response;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const navbarTopicSlice = createSlice({
    name: 'navbarTopic',
    initialState,
    reducers: {
        handleOnClickStem(state, action) {
            const stemName = action.payload?.stemName.toLowerCase();
            state.isOnClickStem = stemName;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStemAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getStemAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.navbarTopicData = action.payload;
            })
            .addCase(getStemAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
    },
});

export const { handleOnClickStem } = navbarTopicSlice.actions;

export default navbarTopicSlice.reducer;
