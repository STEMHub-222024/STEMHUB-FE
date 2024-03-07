import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import bannerReducer from '~/components/Common/SlideShow/slideShowSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        banner: bannerReducer,
    },
});
