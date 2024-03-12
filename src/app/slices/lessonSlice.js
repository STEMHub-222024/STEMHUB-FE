import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as lessonServices from '~/services/lessonServices';

const initialState = {
    data: {
        lessonAll: [],
        lessonItem: [],
        lessonFilter: [],
    },
    status: 'idle',
    errorMessage: '',
};

export const getLessonAsync = createAsyncThunk('lesson/getLessonAsync', async (lessonData, { rejectWithValue }) => {
    try {
        const response = await lessonServices.getLesson();
        return response;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const getLessonIdAsync = createAsyncThunk('lesson/getLessonIdAsync', async (lessonData, { rejectWithValue }) => {
    try {
        const response = await lessonServices.getLessonId(lessonData);
        return response;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const lessonSlice = createSlice({
    name: 'lesson',
    initialState,
    reducers: {
        handleFilter(state, action) {
            state.data.lessonFilter = action.payload?.lessonCurrents;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLessonAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getLessonAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.lessonAll = action.payload;
            })
            .addCase(getLessonAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
        builder
            .addCase(getLessonIdAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getLessonIdAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.lessonItem = action.payload;
            })
            .addCase(getLessonIdAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.errorMessage = action.payload;
            });
    },
});

export const { handleFilter } = lessonSlice.actions;

export default lessonSlice.reducer;
