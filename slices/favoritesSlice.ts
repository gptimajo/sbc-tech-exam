import { createSlice } from '@reduxjs/toolkit';

interface FavoritesState {
    favorites: number[];
}

const initialState: FavoritesState = {
    favorites: [],
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addFavorite: (state, action) => {
            state.favorites.push(action.payload);
        },
        removeFavorite: (state, action) => {
            state.favorites = state.favorites.filter(favorite => favorite !== action.payload);
        },
        clearFavorites: (state) => {
            state.favorites = [];
        },
    },
});

export default favoritesSlice.reducer;
export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export const selectFavorites = (state: { favorites: FavoritesState }) => state.favorites.favorites;