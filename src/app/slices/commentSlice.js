import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as commentServices from '~/services/commentServices';
import * as postServices from '~/services/postServices';

const initialState = {
    data: {
        content_C: '',
        commentNew: {},
        commentNewPosts: {},
        commentNews: [],
        commentNewsPosts: [],
    },
    filter: {
        commentByLessonIds: [],
        commentByPostsIds: [],
    },
    status: 'idle',
    errorMessage: '',
};

export const commentPostAsync = createAsyncThunk('comment/commentPostAsync', async (infoData, { rejectWithValue }) => {
    try {
        const response = await commentServices.postComment(infoData);
        return response;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});
// Posts
export const commentGetPostsAsync = createAsyncThunk('comment/commentGetPostsAsync', async (infoData, { rejectWithValue }) => {
    try {
        const response = await postServices.getCommentPosts(infoData);
        return response;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const commentPostPostsAsync = createAsyncThunk('comment/commentPostPostsAsync', async (infoData, { rejectWithValue }) => {
    try {
        const response = await postServices.postCommentPosts(infoData);
        return response;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const commentGetAllAsync = createAsyncThunk(
    'comment/commentGetAllAsync',
    async (infoData, { rejectWithValue }) => {
        try {
            const response = await commentServices.getComment(infoData);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data.message);
        }
    },
);

export const commentGetIdLessonAsync = createAsyncThunk(
    'comment/commentGetIdLesson',
    async (infoData, { rejectWithValue }) => {
        try {
            const response = await commentServices.getCommentIdLesson(infoData);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data.message);
        }
    },
);

export const commentGetIdAsync = createAsyncThunk(
    'comment/commentGetIdAsync',
    async (infoData, { rejectWithValue }) => {
        try {
            const response = await commentServices.getCommentId(infoData);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data.message);
        }
    },
);

export const removeCommentByIdAsync = createAsyncThunk(
    'comment/removeCommentByIdAsync',
    async (infoData, { rejectWithValue }) => {
        try {
            const response = await commentServices.deleteComment(infoData);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data.message);
        }
    },
);

export const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        setContent_C(state, action) {
            state.data.content_C = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(commentPostAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(commentPostAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.commentNew = action.payload;
                state.filter.commentByLessonIds.push(action.payload);
            })
            .addCase(commentPostAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.message = action.payload;
            });
        builder
            .addCase(commentGetAllAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(commentGetAllAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.commentNews = action.payload;
            })
            .addCase(commentGetAllAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.message = action.payload;
            });
        builder
            .addCase(commentGetIdLessonAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(commentGetIdLessonAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.filter.commentByLessonIds = action.payload;
            })
            .addCase(commentGetIdLessonAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
        builder
            .addCase(removeCommentByIdAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeCommentByIdAsync.fulfilled, (state, action) => {
                const newCommentByLessonIds = state.filter.commentByLessonIds.filter((item) => {
                    return item.commentId !== action.meta.arg.commentId;
                });
                state.filter.commentByLessonIds = newCommentByLessonIds;
            })
            .addCase(removeCommentByIdAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
        builder
            .addCase(commentPostPostsAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(commentPostPostsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.commentNewPosts = action.payload;
                state.filter.commentByPostsIds.push(action.payload);
            })
            .addCase(commentPostPostsAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            })
        builder
            .addCase(commentGetPostsAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(commentGetPostsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.commentNewsPosts = action.payload;
            })
            .addCase(commentGetPostsAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
    },
});

export const { setContent_C } = commentSlice.actions;

export default commentSlice.reducer;
