import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as topicServices from '~/services/topicServices';

const initialState = {
    data: [],
    showOutstanding: [],
    status: 'idle',
    errorMessage: '',
};

//action creator thunk
export const getTopicAsync = createAsyncThunk('topic/getTopicAsync', async (topicData, { rejectWithValue }) => {
    try {
        const response = await topicServices.getTopic();
        return response;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const getOutstanding = createAsyncThunk('topic/getOutstanding', async (outstandingData, { rejectWithValue }) => {
    try {
        const response = await topicServices.getSuggestions();
        return response;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const topicSlice = createSlice({
    name: 'topic',
    initialState,
    reducers: {
        updateOutstanding(state, action) {
            state.status = 'idle';
            const { stemId } = action.payload;
            state.showOutstanding = state?.data.filter((topic) => {
                return topic?.stemId === stemId;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTopicAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getTopicAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(getTopicAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
        builder
            .addCase(getOutstanding.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getOutstanding.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.slice(0, 8);
            })
            .addCase(getOutstanding.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
    },
});

export const { updateOutstanding } = topicSlice.actions;

export default topicSlice.reducer;
