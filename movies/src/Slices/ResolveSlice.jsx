import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const setResolved = createAsyncThunk('resolve/setResolved',async(_id,{rejectWithValue})=>{
    try{
        const response = await fetch('http://localhost:3000/queries/setResolved',{
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id: _id})
        })
        const data = await response.json()
        console.log(data)
        if(data.status === 'success'){
            return {status: data.status}
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

export const ResolveSlice = createSlice({
    name: 'resolve',
    initialState: {
        error: null,
        status: null,
        pending: 0,
        resolved: 0,
    },
    reducers: {
        setPending: (state,action) => {
            state.pending = action.payload;
        },
        getResolved: (state,action) => {
            console.log(action.payload)
            state.resolved = action.payload;
            console.log(state.resolved)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(setResolved.fulfilled,(state,action) => {
                state.error = null;
                state.status = action.payload.status;
            })
            .addCase(setResolved.rejected,(state,action)=>{
                state.error = action.payload;
                state.status = null;
            })
    }
})

export const {setPending,getResolved} = ResolveSlice.actions;
export default ResolveSlice.reducer;