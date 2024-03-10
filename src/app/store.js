import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import bannerReducer from '~/components/Common/SlideShow/slideShowSlice';
import topicReducer from '~/components/Layouts/Components/Topic/topicSlice';
import navbarTopicReducer from '~/components/Layouts/Components/NavbarTopic/navbarTopicSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        banner: bannerReducer,
        topic: topicReducer,
        navbarTopic: navbarTopicReducer,
    },
});
