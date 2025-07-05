import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const bookMyTicket = createAsyncThunk('book/bookMyTicket',async(details,{rejectWithValue})=>{
    try{
        const response = await fetch('http://localhost:3000/tickets/book',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(details)
        })
        const data = await response.json()
        console.log(data)
        if(data.status === 'success'){
            return {status: data.message}
        }
        else{
            return rejectWithValue(data.message)
        }
    }
    catch(err){
        console.log(err)
        return rejectWithValue("Something went Wrong!")
    }
})

export const BookSlice = createSlice({
    name: 'book',
    initialState: {
        bookingStatus: null,
        error: null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(bookMyTicket.fulfilled, (state,action) => {
                state.bookingStatus = action.payload.status;
                state.error = null;
            })
            .addCase(bookMyTicket.rejected, (state,action) => {
                state.error = action.payload;
            })
    }
})

export default BookSlice.reducer