import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const validateToken = createAsyncThunk('validate/validateToken',async(token,{rejectWithValue,getState})=>{
    try{
        const response = await fetch('http://localhost:3000/validateToken',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token:token}),
        })
        const data = await response.json()
        if(data.status === 'success'){
            return {details:data.details,status:"success"}
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

export const ValidateSlice = createSlice({
    name: 'validate',
    initialState: {
        error: null,
        username: null,
        email: null,
        token: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(validateToken.fulfilled, (state,action) => {
                const {username,email,token} = action.payload.details;
                state.username = username;
                state.email = email;
                state.token = token;
                sessionStorage.setItem('token',state.token)
                state.error = null;
            })
            .addCase(validateToken.rejected, (state,action) => {
                state.error = action.payload;
                state.username = null;
                state.email = null;
                state.token = null;
            })
    }
})

export default ValidateSlice.reducer