import { createSlice } from '@reduxjs/toolkit';

interface SearchState {
    search: string;
}

const initialState: SearchState = {
    search: '',
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        clearSearch: (state) => {
            state.search = '';
        },
    },
});

export default searchSlice.reducer;
export const { setSearch, clearSearch } = searchSlice.actions;
export const selectSearch = (state: { search: SearchState }) => state.search.search;