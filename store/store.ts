import { configureStore } from '@reduxjs/toolkit';
import recipesSlice from '../slices/recipesSlice';
import searchSlice from '../slices/searchSlice';
import toastSlice from '../slices/toastSlice';

export function makeStore() {
    return configureStore({
        reducer: {
            recipes: recipesSlice,
            search: searchSlice,
            toast: toastSlice,
        // Add your reducers here
        },
        devTools: process.env.NODE_ENV !== 'production',
    });
};
export const store = makeStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
