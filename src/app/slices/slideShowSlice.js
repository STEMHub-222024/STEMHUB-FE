import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as bannerServices from '~/services/bannerServices';

const initialState = {
    data: [],
    status: 'idle',
    errorMessage: '',
};

//action creator thunk
export const getBannerAsync = createAsyncThunk('banner/fetchBanner', async (bannerData, { rejectWithValue }) => {
    try {
        const response = await bannerServices.getBanner();
        return response;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const bannerSlice = createSlice({
    name: 'banner',
    initialState,

    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBannerAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getBannerAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(getBannerAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
    },
});

export const {} = bannerSlice.actions;

export default bannerSlice.reducer;
