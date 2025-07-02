import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getUserDetails = createAsyncThunk('user/getUserDetails',async(username,{rejectWithValue})=>{
    try{
        const response = await fetch('http://localhost:3000/getUserDetails',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username}),
        })
        const data = await response.json()
        console.log(data)
        if(data.status === 'success'){
            return {details: data.details}
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


export const UserSlice = createSlice({
    name: 'user',
    initialState: {
        role: null,
        username: null,
        theme: null,
        email: null,
        mobile: null,
        error: null,
    },
    reducers: {
        setRole: (state,action) => {
            state.role = action.payload;
        },
        setUsername: (state,action) => {
            state.username = action.payload;
        },
        setEmail: (state,action) => {
            state.email = action.payload;
        },
        setTheme: (state,action) => {
            state.theme = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserDetails.fulfilled, (state,action) => {
                const dtls = action.payload.details;
                state.username = dtls.username;
                state.email = dtls.mobile;
                state.mobile = dtls.mobile;
            })
            .addCase(getUserDetails.rejected, (state,action) => {
                state.error = action.payload;
            })
    }
})

export const {setRole,setUsername,setEmail,setTheme} = UserSlice.actions;
export default UserSlice.reducer;