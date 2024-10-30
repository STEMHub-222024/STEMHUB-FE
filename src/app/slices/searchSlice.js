import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as searchService from '~/services/searchServices';

const initialState = {
    data: {
        searchTopics: [],
        searchLessons: [],
        searchPosts: [],
        searchTopKeywords: [],
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

export const searchTopKeywordsAsync = createAsyncThunk(
    'search/searchTopKeywordsAsync',
    async (_, { rejectWithValue }) => {
        try {
            const response = await searchService.searchTopKeywords();
            return response;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const searchLessonAsync = createAsyncThunk(
    'search/searchLessonAsync',
    async (lessonKeyData, { rejectWithValue }) => {
        try {
            const response = await searchService.searchLessonKey(lessonKeyData);
            return response;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const searchNewspaperArticleAsync = createAsyncThunk(
    'search/searchNewspaperArticleAsync',
    async (newspaperArticleKeyData, { rejectWithValue }) => {
        try {
            const response = await searchService.searchNewspaperArticle(newspaperArticleKeyData);
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
        updateLessonSearch(state, action) {
            state.data.searchLessons = action.payload;
        },
        updatePostsSearch(state, action) {
            state.data.searchPosts = action.payload;
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
        builder
            .addCase(searchLessonAsync.pending, (state) => {
                state.status = 'loading';
                state.data.loading = true;
            })
            .addCase(searchLessonAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.searchLessons = action.payload;
                state.data.loading = false;
            })
            .addCase(searchLessonAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
                state.data.loading = false;
            });
        builder
            .addCase(searchNewspaperArticleAsync.pending, (state) => {
                state.status = 'loading';
                state.data.loading = true;
            })
            .addCase(searchNewspaperArticleAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.searchPosts = action.payload;
                state.data.loading = false;
            })
            .addCase(searchNewspaperArticleAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
                state.data.loading = false;
            });
        builder
            .addCase(searchTopKeywordsAsync.pending, (state) => {
                state.status = 'loading';
                state.data.loading = true;
            })
            .addCase(searchTopKeywordsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.searchTopKeywords = action.payload;
                state.data.loading = false;
            })
            .addCase(searchTopKeywordsAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
                state.data.loading = false;
            });
    },
});

export const { updateTopicSearch, updateLessonSearch, updatePostsSearch } = searchSlice.actions;

export default searchSlice.reducer;
