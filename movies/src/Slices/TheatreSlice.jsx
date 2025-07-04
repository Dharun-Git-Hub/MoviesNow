import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const loadTheatres = createAsyncThunk('movies/loadTheatres', async(_,{rejectWithValue})=>{
    try{
        const response = await fetch('http://localhost:3000/theatres');
        const data = await response.json()
        if(data.status === 'success'){
            return {list: data.list}
        }
        else{
            return rejectWithValue(data.message)
        }
    }
    catch(err){
        console.log(err)
        return rejectWithValue('Something went Wrong!');
    }
})

export const TheatreSlice = createSlice({
    name: "movies",
    initialState: {
        theatresList: [],
        theatresGetError: null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTheatres.fulfilled, (state,action) => {
                state.theatresList = action.payload.list;
                state.theatresGetError = null;
            })
            .addCase(loadTheatres.rejected, (state,action) => {
                state.theatresList = [];
                state.theatresGetError = action.payload;
            })
    }
})

export default TheatreSlice.reducer