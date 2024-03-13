import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import bannerReducer from '~/app/slices/slideShowSlice';
import topicReducer from '~/app/slices/topicSlice';
import navbarTopicReducer from '~/app/slices/navbarTopicSlice';
import lessonReducer from '~/app/slices/lessonSlice';
import videoReducer from '~/app/slices/videoSlice';
import searchReducer from '~/app/slices/searchSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        banner: bannerReducer,
        topic: topicReducer,
        navbarTopic: navbarTopicReducer,
        lesson: lessonReducer,
        video: videoReducer,
        search: searchReducer,
    },
});
