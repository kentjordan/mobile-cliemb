import { configureStore } from '@reduxjs/toolkit';
import { appSliceReduer } from './app.slice';

const store = configureStore({
    reducer: {
        app: appSliceReduer
    }
});

export type RootState = ReturnType<typeof store.getState>

export default store;