import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import bannerReducer from '~/app/slices/slideShowSlice';
import topicReducer from '~/app/slices/topicSlice';
import navbarTopicReducer from '~/app/slices/navbarTopicSlice';
import lessonReducer from '~/app/slices/lessonSlice';
import videoReducer from '~/app/slices/videoSlice';
import searchReducer from '~/app/slices/searchSlice';
import authReducer from '~/app/slices/authSlice';
import ingredientReducer from '~/app/slices/ingredientSlice';
import userReducer from '~/app/slices/userSlice';
import commentReducer from '~/app/slices/commentSlice';
import postsReducer from '~/app/slices/postSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        banner: bannerReducer,
        topic: topicReducer,
        navbarTopic: navbarTopicReducer,
        lesson: lessonReducer,
        video: videoReducer,
        search: searchReducer,
        auth: authReducer,
        ingredient: ingredientReducer,
        user: userReducer,
        comment: commentReducer,
        posts: postsReducer,
    },
});
