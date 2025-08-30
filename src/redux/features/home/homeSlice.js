import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { downloadingWaterBenderAll, downloadingWaterBenderAvg, downloadingWaterBenderLast, downloadingWaterBenderMonthly, downloadingWaterBenderDaily, downloadingWaterBenderForecast } from './homeService'

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

export const downloadingWaterBenderDailyAsync = createAsyncThunk(
    'downloadingWaterBenderDailyAsync', async (_, thunkAPI) => {
        try {
            return await downloadingWaterBenderDaily()
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

export const downloadingWaterBenderForecastAsync = createAsyncThunk(
    'downloadingWaterBenderForecastAsync', async (hours = 12, thunkAPI) => {
        try {
            return await downloadingWaterBenderForecast(hours)
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
        waterBenderForecast: [],
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
            state.waterBenderForecast = [],
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
            .addCase(downloadingWaterBenderDailyAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(downloadingWaterBenderDailyAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.waterBenderDaily = action.payload;
            })
            .addCase(downloadingWaterBenderDailyAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(downloadingWaterBenderForecastAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(downloadingWaterBenderForecastAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.waterBenderForecast = action.payload;
            })
            .addCase(downloadingWaterBenderForecastAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    },
})

export const { resetHome } = homeSlice.actions
export default homeSlice.reducer