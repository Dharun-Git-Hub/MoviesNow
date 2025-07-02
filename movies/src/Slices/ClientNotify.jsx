import { createSlice } from "@reduxjs/toolkit";

export const ClientNotify = createSlice({
    name: 'client',
    initialState: {
        count: 0,
    },
    reducers: {
        increment: (state) => {
            state.count += 1;
        },
        decrement: (state) => {
            state.count -= 1;
        },
        clear: (state) => {
            state.count = 0;
        }
    }
})

export const {increment,decrement,clear} = ClientNotify.actions;
export default ClientNotify.reducer;