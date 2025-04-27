import { createSlice } from '@reduxjs/toolkit';

interface ToastState {
    message: string;
}

const initialState: ToastState = {
    message: '',
};

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        setToast: (state, action) => {
            state.message = action.payload;
        },
        clearToast: (state) => {
            state.message = '';
        },
    },
});

export default toastSlice.reducer;
export const { setToast, clearToast } = toastSlice.actions;
export const selectToast = (state: { toast: ToastState }) => state.toast.message;