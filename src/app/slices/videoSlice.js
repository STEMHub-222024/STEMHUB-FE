import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as videoService from '~/services/videoServices';

const initialState = {
    data: {
        videoAll: [],
        videoFilter: [],
    },
    status: 'idle',
    errorMessage: '',
};

export const getVideoAsync = createAsyncThunk('video/getVideoAsync', async (videoData, { rejectWithValue }) => {
    try {
        const response = await videoService.getVideo();
        return response;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        getVideoLesson(state, action) {
            state.data.videoFilter = action.payload?.videoLesson;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getVideoAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getVideoAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.videoAll = action.payload;
            })
            .addCase(getVideoAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
    },
});

export const { getVideoLesson } = videoSlice.actions;

export default videoSlice.reducer;
