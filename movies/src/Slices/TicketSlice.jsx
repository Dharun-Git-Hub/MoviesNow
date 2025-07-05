import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getMovieRevenue = createAsyncThunk('revenue/getMovieRevenue',async(_,{rejectWithValue})=>{
    try{
        const response = await fetch('http://localhost:3000/movies/revenue')
        const data = await response.json()
        console.log(data)
        if(data.status === 'success'){
            return {movieRevenue:data.result}
        }
        else{
            return rejectWithValue("Fetching not finished!")
        }
    }
    catch(err){
        console.log(err)
        return rejectWithValue('Something went wrong')
    }
})

export const getTheatreRevenue = createAsyncThunk('revenue/getTheatreRevenue',async(_,{rejectWithValue})=>{
    try{
        const response = await fetch('http://localhost:3000/theatres/revenue')
        const data = await response.json()
        console.log(data)
        if(data.status === 'success'){
            return {theatreRevenue:data.result}
        }
        else{
            return rejectWithValue("Fetching not finished!")
        }
    }
    catch(err){
        console.log(err)
        return rejectWithValue('Something went wrong')
    }
})

export const TicketSlice = createSlice({
    name: 'revenue',
    initialState: {
        theatreRevenue: [],
        movieRevenue: [],
        error: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTheatreRevenue.fulfilled, (state,action) => {
                state.theatreRevenue = action.payload.theatreRevenue;
                state.error = null;
            })
            .addCase(getTheatreRevenue.rejected, (state,action) => {
                state.error = action.payload;
            });
        builder
            .addCase(getMovieRevenue.fulfilled, (state,action) => {
                state.movieRevenue = action.payload.movieRevenue;
                state.error = null;
            })
            .addCase(getMovieRevenue.rejected, (state,action) => {
                state.error = action.payload;
            })
    }
})

export default TicketSlice.reducer