import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as postServices from '~/services/postServices';

const initialState = {
    data: {
        title: '',
        markdown: '',
        htmlContent: '',
        posts: [],
    },
    status: 'idle',
    errorMassage: '',
};

export const getPostsAsync = createAsyncThunk('post/getPostsAsync', async (infoData, { rejectWithValue }) => {
    try {
        const response = await postServices.getPosts();
        return response;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const postPostsAsync = createAsyncThunk('post/postPostsAsync', async (infoData, { rejectWithValue }) => {
    try {
        const response = await postServices.postPosts(infoData);
        return response;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setTitle(state, action) {
            state.data.title = action.payload;
        },
        setMarkdown(state, action) {
            state.data.markdown = action.payload;
        },
        setHtmlContent(state, action) {
            state.data.htmlContent = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPostsAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getPostsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.posts = action.payload.slice(-8);
            })
            .addCase(getPostsAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMassage = action.payload;
            });
        builder
            .addCase(postPostsAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(postPostsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.posts.push(action.payload);
            })
            .addCase(postPostsAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMassage = action.payload;
            });
    },
});

export const { setTitle, setMarkdown, setHtmlContent } = postSlice.actions;
export default postSlice.reducer;
