import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as topicServices from '~/services/topicServices';

const initialState = {
    data: [],
    topicIds: {},
    topicTop4: [],
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

export const getTopicTop4 = createAsyncThunk('topic/getTopicTop4', async (topicData, { rejectWithValue }) => {
    try {
        const response = await topicServices.getTopicTop4();
        return response;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const getOutstanding = createAsyncThunk('topic/getOutstanding', async (outstandingData, { rejectWithValue }) => {
    try {
        const response = await topicServices.getSuggestions(outstandingData);
        return response;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const getTopicId = createAsyncThunk('topic/getTopicId', async (topicData, { rejectWithValue }) => {
    try {
        const response = await topicServices.getTopicId(topicData);
        return response;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const topicSlice = createSlice({
    name: 'topic',
    initialState,
    reducers: {},
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
                state.showOutstanding = action.payload;
            })
            .addCase(getOutstanding.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
        builder
            .addCase(getTopicId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getTopicId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.topicIds = action.payload;
            })
            .addCase(getTopicId.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
        builder
            .addCase(getTopicTop4.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getTopicTop4.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.topicTop4 = action.payload;
            })
            .addCase(getTopicTop4.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
    },
});

export default topicSlice.reducer;
