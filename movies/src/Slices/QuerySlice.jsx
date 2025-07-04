import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const placeQuery = createAsyncThunk('query/placeQuery',async(msg,{rejectWithValue}) => {
    try{
        const response = await fetch('http://localhost:3000/placeQuery',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(msg),
        })
        const data = await response.json()
        console.log(data)
        if(data.status === 'success'){
            return {status:data.status}
        }
        else{
            return rejectWithValue(data.message)
        }
    }
    catch(err){
        console.log(err)
        return rejectWithValue('Something went Wrong')
    }
})

export const QuerySlice = createSlice({
    name: 'query',
    initialState: {
        error: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(placeQuery.fulfilled, (state) => {
                state.error = null;
            })
            .addCase(placeQuery.rejected, (state,action) => {
                state.error = action.payload;
            })
    }
})

export default QuerySlice