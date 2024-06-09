import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { uploadRegisterAsync } from './registerService'

export const fetchRegister = createAsyncThunk(
    'auth/register', async (data, thunkAPI) => {
        try {
            return await uploadRegisterAsync(data)
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

export const registerSlice = createSlice({
    name: 'register',
    initialState: {
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: '',
    },
    reducers: {
        resetRegister: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
        resetError: (state) => {
            state.isError = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRegister.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchRegister.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(fetchRegister.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    },
})

export const { resetRegister, resetError, resetSuccess } = registerSlice.actions
export default registerSlice.reducer