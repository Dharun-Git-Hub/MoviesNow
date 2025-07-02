import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const loadMovies = createAsyncThunk('movies/loadMovies', async(_,{rejectWithValue,getState})=>{
    try{
        const response = await fetch('http://localhost:3000/movies');
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

export const MoviesSlice = createSlice({
    name: "movies",
    initialState: {
        moviesList: [],
        moviesGetError: null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadMovies.fulfilled, (state,action) => {
                state.moviesList = action.payload.list;
                state.moviesGetError = null;
            })
            .addCase(loadMovies.rejected, (state,action) => {
                state.moviesList = [];
                state.moviesGetError = action.payload;
            })
    }
})

export default MoviesSlice.reducer