import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { uploadLogin } from './loginService'

// Login user
export const uploadLoginAsync = createAsyncThunk(
    'auth/login', async (data, thunkAPI) => {
        try {
            return await uploadLogin(data)
        } catch (error) {
            const message =
                (JSON.stringify(error.response) &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    })

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        username: '',
        password: '',
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: '',
    },
    reducers: {
        resetAuth: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
        resetLogin: (state) => {
            state.username = ''
            state.password = ''
        },
        logout: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
        setUsername: (state, action) => { state.username = action.payload },
        setPassword: (state, action) => { state.password = action.payload },
        resetAllDataAuth: (state) => {
            state.username = '';
            state.password = '';
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadLoginAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(uploadLoginAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload.User
            })
            .addCase(uploadLoginAsync.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    },
})

export const { resetAuth, resetLogin, setUsername, setPassword, logout, resetAllDataAuth } = authSlice.actions
export default authSlice.reducer