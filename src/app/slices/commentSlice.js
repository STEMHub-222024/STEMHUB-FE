import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as commentServices from '~/services/commentServices';

const initialState = {
    data: {
        content_C: '',
        commentNew: {},
        commentNews: [],
    },
    filter: {
        commentByLessonIds: [],
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

export const commentGetAllAsync = createAsyncThunk(
    'comment/commentGetAllAsync',
    async (infoData, { rejectWithValue }) => {
        try {
            const response = await commentServices.getComment();
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

export const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        setContent_C(state, action) {
            state.data.content_C = action.payload;
        },
        updateComment(state, action) {
            state.filter.commentByLessonIds = action.payload;
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
    },
});

export const { setContent_C, updateComment } = commentSlice.actions;

export default commentSlice.reducer;
