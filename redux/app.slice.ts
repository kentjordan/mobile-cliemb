import { createSlice } from "@reduxjs/toolkit";
import type User from "./types/User";

type InitialState = {
    user: undefined | User
}

const initialState: InitialState = {
    user: undefined
}

const appSlice = createSlice({
    name: "app_slice",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        }
    }
});

export const { setUser } = appSlice.actions;

export const appSliceReduer = appSlice.reducer;

export default appSlice;