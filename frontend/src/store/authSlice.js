import { createSlice } from "@reduxjs/toolkit";

const loadUser = () => {
    try {
        const raw = localStorage.getItem('auth_user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const saveUser = (user) => {
    try {
        if (user) {
            localStorage.setItem('auth_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('auth_user');
        }
    } catch {}
};

const initialState = {
    user: typeof window !== 'undefined' ? loadUser() : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            saveUser(action.payload);
        },
        logout: (state) => {
            state.user = null;
            saveUser(null);
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;