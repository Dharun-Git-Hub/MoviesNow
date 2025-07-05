import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getCastingTheatres = createAsyncThunk('castingTheatres/getCastingTheatres', async(movie,{rejectWithValue})=>{
    try{
        const response = await fetch('http://localhost:3000/tickets/getCasters',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({movie: movie})
        })
        const data = await response.json()
        console.log(data)
        if(data.status === 'success'){
            return {list: data.list}
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

export const Theatres = createSlice({
    name: 'castingTheatres',
    initialState: {
        theatres: [],
        error: null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getCastingTheatres.fulfilled, (state,action) => {
                state.theatres = action.payload.list;
                state.error = null;
            })
            .addCase(getCastingTheatres.rejected, (state,action) => {
                state.theatres = [];
                state.error = action.payload;
            })
    }
})

export default Theatres