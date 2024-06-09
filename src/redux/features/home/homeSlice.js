import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { downloadingWaterBenderAll, downloadingWaterBenderAvg, downloadingWaterBenderLast, downloadingWaterBenderMonthly } from './homeService'

export const downloadingWaterBenderLastAsync = createAsyncThunk(
    'downloadingWaterBenderLastAsync', async (_, thunkAPI) => {
        try {
            return await downloadingWaterBenderLast()
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

export const downloadingWaterBenderAvgAsync = createAsyncThunk(
    'downloadingWaterBenderAvgAsync', async (params, thunkAPI) => {
        try {
            return await downloadingWaterBenderAvg(params)
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

export const downloadingWaterBenderMonthlyAsync = createAsyncThunk(
    'downloadingWaterBenderMonthlyAsync', async (year, thunkAPI) => {
        try {
            return await downloadingWaterBenderMonthly(year)
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

export const homeSlice = createSlice({
    name: 'home',
    initialState: {
        isLoading: false,
        isError: false,
        isSuccess: false,
        isInfo: false,
        waterBenderLast: [],
        waterBenderAvg: [],
        waterBenderMonthly: [],
        waterBenderDaily: [],
        message: '',
    },
    reducers: {
        resetHome: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isInfo = false;
            state.isSuccess = false;
            state.waterBenderLast = [];
            state.waterBenderAvg = [],
            state.waterBenderMonthly = [],
            state.waterBenderDaily = [],
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(downloadingWaterBenderLastAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(downloadingWaterBenderLastAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.waterBenderLast = action.payload;
            })
            .addCase(downloadingWaterBenderLastAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(downloadingWaterBenderAvgAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(downloadingWaterBenderAvgAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.waterBenderAvg = action.payload;
            })
            .addCase(downloadingWaterBenderAvgAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(downloadingWaterBenderMonthlyAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(downloadingWaterBenderMonthlyAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.waterBenderMonthly = action.payload;
            })
            .addCase(downloadingWaterBenderMonthlyAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    },
})

export const { resetHome } = homeSlice.actions
export default homeSlice.reducer