import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as searchService from '~/services/topicServices';

const initialState = {
    data: {
        searchTopics: [],
        searchPosts: [],
        loading: false,
    },
    status: 'idle',
    errorMessage: '',
};

export const searchTopicAsync = createAsyncThunk(
    'search/searchTopicAsync',
    async (topicKeyData, { rejectWithValue }) => {
        try {
            const response = await searchService.searchTopiKey(topicKeyData);
            return response;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        updateTopicSearch(state, action) {
            state.data.searchTopics = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchTopicAsync.pending, (state) => {
                state.status = 'loading';
                state.data.loading = true;
            })
            .addCase(searchTopicAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.searchTopics = action.payload;
                state.data.loading = false;
            })
            .addCase(searchTopicAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
                state.data.loading = false;
            });
    },
});

export const { updateTopicSearch } = searchSlice.actions;

export default searchSlice.reducer;
