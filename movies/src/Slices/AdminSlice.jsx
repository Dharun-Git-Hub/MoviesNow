import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const adminLogin = createAsyncThunk('admin/adminLogin', async(credentials,{rejectWithValue}) => {
    const {email,password} = credentials;
    try{
        const response = await fetch('http://localhost:3000/adminLogin',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email: email, password: password})
        })
        const data = await response.json()
        console.log(data)
        if(data.status === 'success'){
            return {email: data.email}
        }
        else{
            return rejectWithValue(data.message)
        }
    }
    catch(err){
        console.log(err)
        return rejectWithValue("Something went Wrong")
    }
})

export const AdminSlice = createSlice({
    name: 'admin',
    initialState: {
        username: null,
        email: null,
        error: null,
    },
    reducers: {
        setUsername: (state,action) => {
            state.username = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.fulfilled, (state,action) => {
                state.email = action.payload;
                state.error = null;
            })
            .addCase(adminLogin.rejected, (state,action) => {
                state.email = null;
                state.error = action.payload;
            })
    }
})

export const {setUsername} = AdminSlice.actions;
export default AdminSlice.reducer;