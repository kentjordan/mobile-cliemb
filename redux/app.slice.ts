import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    access_token: undefined,
    user: undefined
}

const appSlice = createSlice({
    name: "app_slice",
    initialState,
    reducers: {
        setAccessToken: (state, payload) => { }
    }
});

export const appSliceReduer = appSlice.reducer;

export default appSlice;