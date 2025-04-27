import  { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clear } from 'console';

export const fetchRecipes = createAsyncThunk(
    'recipe/fetchRecipes',
    async (search:string, { rejectWithValue }) => {
        const url = new URL('https://680b406dd5075a76d98a61b3.mockapi.io/recipes');
        if (search) {
            url.searchParams.append('title', search);
        }
        try {
            const response = await fetch(url.toString());
            if (!response.ok) {
                return rejectWithValue(response.statusText);
            }
            const data = await response.json();
            return data;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catch (error: any) {
            if (!error.response || !error.response.data) {
                throw error;
            }
            return rejectWithValue(error?.response?.data);
        }
    });

interface Recipe {
    // Define the structure of a recipe object
    id: number;
    name: string;
    email: string;
    title: string;
    image: string;
    description: string;
    instructions: string;
    ingredients: string;
    createdAt: string;
}

interface RecipesState {
    recipes: Recipe[];
    loading: boolean;
    error: string;
}

const initialState: RecipesState = {
    recipes: [],
    loading: false,
    error: '',
};

const recipesSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {
        clearRecipes: (state) => {
            state.recipes = [];
            state.loading = false;
            state.error = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecipes.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRecipes.fulfilled, (state, action) => {
                state.loading = false;
                state.recipes = [...action.payload];
            })
            .addCase(fetchRecipes.rejected, (state) => {
                state.loading = false;
                state.error = 'Failed to fetch recipes';
            });
    }
});

export default recipesSlice.reducer;
export const { clearRecipes } = recipesSlice.actions;
export const selectRecipes = (state: { recipes: RecipesState }) => state.recipes.recipes;
export const selectRecipesLoading = (state: { recipes: RecipesState }) => state.recipes.loading;
export const selectRecipesError = (state: { recipes: RecipesState }) => state.recipes.error;
