import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const noOfTheatres = createAsyncThunk('dash/noOfTheatres',async(_,{rejectWithValue})=>{
    try{
        const response = await fetch('http://localhost:3000/noOfTheatres')
        const data = await response.json()
        console.log(data)
        if(data.status === 'success'){
            return {data: data.details}
        }
        else{
            return rejectWithValue(data.message)
        }
    }
    catch(err){
        console.log(err)
        return rejectWithValue('Something went Wrong!')
    }
})

export const DashSlice = createSlice({
    name: 'dash',
    initialState: {
        error: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(noOfTheatres.fulfilled, (state,action) => {
                state.list = action.payload.data;
                state.error = null;
            })
            .addCase(noOfTheatres.rejected, (state,action) => {
                state.error = action.payload;
            })
    }
})

export default DashSlice.reducer