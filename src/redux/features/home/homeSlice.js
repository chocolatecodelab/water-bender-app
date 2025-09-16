/**
 * Home Feature Slice
 * 
 * Manages state for water monitoring dashboard and data fetching operations.
 * Handles multiple types of water sensor data including real-time readings,
 * historical averages, daily/monthly trends, and forecast predictions.
 * 
 * Features:
 * - Real-time water sensor data fetching
 * - Historical data aggregation (daily, monthly, average)
 * - Weather forecast integration
 * - Loading states and error handling
 * - Data persistence across app sessions
 * 
 * State Structure:
 * - waterBenderLast: Latest sensor reading
 * - waterBenderAvg: Average readings for date range
 * - waterBenderMonthly: Monthly aggregated data
 * - waterBenderDaily: Daily sensor readings
 * - waterBenderForecast: Weather forecast predictions
 * 
 * @file src/redux/features/home/homeSlice.js
 * @version 1.0.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    downloadingWaterBenderAvg, 
    downloadingWaterBenderLast, 
    downloadingWaterBenderMonthly, 
    downloadingWaterBenderDaily, 
    downloadingWaterBenderForecast 
} from './homeService';

// ===== ASYNC THUNK ACTIONS =====

/**
 * Fetch latest water sensor reading
 * Retrieves the most recent sensor data for real-time display
 * 
 * @async
 * @function downloadingWaterBenderLastAsync
 * @returns {Promise<Object>} Latest sensor data
 * @throws {string} Error message if request fails
 */
export const downloadingWaterBenderLastAsync = createAsyncThunk(
    'home/downloadingWaterBenderLast',
    async (_, { rejectWithValue }) => {
        try {
            const data = await downloadingWaterBenderLast();
            console.log('✅ Latest water data fetched successfully');
            return data;
        } catch (error) {
            const errorMessage = extractErrorMessage(error);
            console.error('❌ Failed to fetch latest water data:', errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Fetch average water sensor readings for date range
 * Calculates and retrieves average readings within specified period
 * 
 * @async
 * @function downloadingWaterBenderAvgAsync
 * @param {Object} params - Date range parameters
 * @param {string} params.startDate - Start date for averaging
 * @param {string} params.endDate - End date for averaging
 * @returns {Promise<Object>} Average sensor data
 * @throws {string} Error message if request fails
 */
export const downloadingWaterBenderAvgAsync = createAsyncThunk(
    'home/downloadingWaterBenderAvg',
    async (params, { rejectWithValue }) => {
        try {
            // Validate required parameters
            if (!params?.startDate || !params?.endDate) {
                throw new Error('Start date and end date are required');
            }
            
            const data = await downloadingWaterBenderAvg(params);
            console.log('✅ Average water data fetched successfully', {
                dateRange: `${params.startDate} to ${params.endDate}`,
                dataPoints: data?.length || 0
            });
            return data;
        } catch (error) {
            const errorMessage = extractErrorMessage(error);
            console.error('❌ Failed to fetch average water data:', errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Fetch monthly aggregated water sensor data
 * Retrieves monthly statistics for the specified year
 * 
 * @async
 * @function downloadingWaterBenderMonthlyAsync
 * @param {string|number} year - Target year for monthly data
 * @returns {Promise<Array>} Monthly aggregated data
 * @throws {string} Error message if request fails
 */
export const downloadingWaterBenderMonthlyAsync = createAsyncThunk(
    'home/downloadingWaterBenderMonthly',
    async (year, { rejectWithValue }) => {
        try {
            // Validate year parameter
            const currentYear = new Date().getFullYear();
            const targetYear = Number(year) || currentYear;
            
            if (targetYear < 2020 || targetYear > currentYear + 1) {
                throw new Error(`Invalid year: ${targetYear}. Must be between 2020 and ${currentYear + 1}`);
            }
            
            const data = await downloadingWaterBenderMonthly(targetYear);
            console.log('✅ Monthly water data fetched successfully', {
                year: targetYear,
                months: data?.length || 0
            });
            return data;
        } catch (error) {
            const errorMessage = extractErrorMessage(error);
            console.error('❌ Failed to fetch monthly water data:', errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Fetch daily water sensor readings
 * Retrieves current day's hourly sensor readings
 * 
 * @async
 * @function downloadingWaterBenderDailyAsync
 * @returns {Promise<Array>} Daily sensor readings
 * @throws {string} Error message if request fails
 */
export const downloadingWaterBenderDailyAsync = createAsyncThunk(
    'home/downloadingWaterBenderDaily',
    async (_, { rejectWithValue }) => {
        try {
            const data = await downloadingWaterBenderDaily();
            console.log('✅ Daily water data fetched successfully', {
                readings: data?.length || 0,
                date: new Date().toISOString().split('T')[0]
            });
            return data;
        } catch (error) {
            const errorMessage = extractErrorMessage(error);
            console.error('❌ Failed to fetch daily water data:', errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Fetch water level forecast predictions
 * Retrieves weather forecast data for specified hour range
 * 
 * @async
 * @function downloadingWaterBenderForecastAsync
 * @param {number} hours - Number of hours to forecast (default: 12)
 * @returns {Promise<Array>} Forecast predictions
 * @throws {string} Error message if request fails
 */
export const downloadingWaterBenderForecastAsync = createAsyncThunk(
    'home/downloadingWaterBenderForecast',
    async (_, { rejectWithValue }) => {
        try {
            const data = await downloadingWaterBenderForecast();
            console.log('✅ Forecast data fetched successfully', {
                predictions: data?.length || 0
            });
            return data;
        } catch (error) {
            const errorMessage = extractErrorMessage(error);
            console.error('❌ Failed to fetch forecast data:', errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

// ===== HELPER FUNCTIONS =====

/**
 * Extract meaningful error message from error object
 * Standardizes error message extraction across different error types
 * 
 * @param {Error|Object} error - Error object from API or network
 * @returns {string} Standardized error message
 */
const extractErrorMessage = (error) => {
    // Handle different error structures
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    
    if (error?.message) {
        return error.message;
    }
    
    if (typeof error === 'string') {
        return error;
    }
    
    // Fallback for unknown error structures
    return 'An unexpected error occurred while fetching water data';
};

/**
 * Reset loading state and clear errors
 * Utility function to standardize state reset across actions
 * 
 * @param {Object} state - Current slice state
 */
const resetAsyncState = (state) => {
    state.isLoading = false;
    state.isError = false;
    state.isSuccess = false;
    state.message = '';
};

// ===== SLICE DEFINITION =====

/**
 * Home slice configuration
 * Defines the structure and behavior of home-related state
 */
export const homeSlice = createSlice({
    name: 'home',
    
    /**
     * Initial state structure
     * Defines default values for all state properties
     */
    initialState: {
        // Async operation states
        isLoading: false,           // General loading indicator
        isForecastLoading: false,   // Specific loading for forecast data
        isError: false,             // Error state flag  
        isSuccess: false,           // Success state flag
        isInfo: false,              // Info notification flag
        message: '',                // Status/error message
        
        // Water sensor data
        waterBenderLast: [],        // Latest sensor reading
        waterBenderAvg: [],         // Average readings for period
        waterBenderMonthly: [],     // Monthly aggregated data
        waterBenderDaily: [],       // Daily hourly readings
        waterBenderForecast: [],    // Forecast predictions
        
        // Performance tracking
        lastForecastUpdate: null,   // Timestamp of last forecast update
        forecastCacheExpiry: null,  // When forecast cache expires
        
        // Metadata
        lastUpdated: null,          // Timestamp of last data update
        dataSource: 'api',          // Source of current data
    },
    
    /**
     * Synchronous reducers
     * Handle direct state mutations and utility actions
     */
    reducers: {
        /**
         * Reset home state to initial values
         * Used for logout, data refresh, or error recovery
         */
        resetHome: (state) => {
            console.log('🔄 Resetting home state');
            
            resetAsyncState(state);
            
            // Clear all data arrays
            state.waterBenderLast = [];
            state.waterBenderAvg = [];
            state.waterBenderMonthly = [];
            state.waterBenderDaily = [];
            state.waterBenderForecast = [];
            
            // Reset metadata
            state.lastUpdated = null;
            state.dataSource = 'api';
            state.isForecastLoading = false;
            state.lastForecastUpdate = null;
            state.forecastCacheExpiry = null;
        },
        
        /**
         * Clear only error states
         * Useful for dismissing error messages without losing data
         */
        clearErrors: (state) => {
            state.isError = false;
            state.message = '';
        },
        
        /**
         * Set forecast loading state specifically
         * Allows UI to show forecast-specific loading indicators
         */
        setForecastLoading: (state, action) => {
            state.isForecastLoading = action.payload !== undefined ? action.payload : true;
        },
        
        /**
         * Set info notification state
         * Used for displaying informational messages to user
         */
        setInfo: (state, action) => {
            state.isInfo = true;
            state.message = action.payload || 'Information updated';
        },
        
        /**
         * Clear info notification state
         */
        clearInfo: (state) => {
            state.isInfo = false;
            state.message = '';
        },
        
        /**
         * Update last updated timestamp
         * Tracks when data was last refreshed
         */
        updateLastRefresh: (state) => {
            state.lastUpdated = new Date().toISOString();
        },
        
        /**
         * Update forecast cache metadata
         * Tracks forecast data freshness for performance optimization
         */
        updateForecastCache: (state) => {
            const now = new Date().toISOString();
            state.lastForecastUpdate = now;
            state.forecastCacheExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes
        },
    },
    
    /**
     * Extra reducers for async thunk actions
     * Handle pending, fulfilled, and rejected states for each async operation
     */
    extraReducers: (builder) => {
        builder
            // ===== LATEST WATER DATA =====
            .addCase(downloadingWaterBenderLastAsync.pending, (state) => {
                state.isLoading = true;
                resetAsyncState(state);
            })
            .addCase(downloadingWaterBenderLastAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.waterBenderLast = action.payload;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(downloadingWaterBenderLastAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.waterBenderLast = []; // Clear stale data on error
            })
            
            // ===== AVERAGE WATER DATA =====
            .addCase(downloadingWaterBenderAvgAsync.pending, (state) => {
                state.isLoading = true;
                resetAsyncState(state);
            })
            .addCase(downloadingWaterBenderAvgAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.waterBenderAvg = action.payload;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(downloadingWaterBenderAvgAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.waterBenderAvg = [];
            })
            
            // ===== MONTHLY WATER DATA =====
            .addCase(downloadingWaterBenderMonthlyAsync.pending, (state) => {
                state.isLoading = true;
                resetAsyncState(state);
            })
            .addCase(downloadingWaterBenderMonthlyAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.waterBenderMonthly = action.payload;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(downloadingWaterBenderMonthlyAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.waterBenderMonthly = [];
            })
            
            // ===== DAILY WATER DATA =====
            .addCase(downloadingWaterBenderDailyAsync.pending, (state) => {
                state.isLoading = true;
                resetAsyncState(state);
            })
            .addCase(downloadingWaterBenderDailyAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.waterBenderDaily = action.payload;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(downloadingWaterBenderDailyAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.waterBenderDaily = [];
            })
            
            // ===== FORECAST DATA (OPTIMIZED) =====
            .addCase(downloadingWaterBenderForecastAsync.pending, (state) => {
                console.log('🔄 Loading forecast data...');
                state.isForecastLoading = true; // Specific loading state untuk forecast
                state.isError = false;
                state.message = '';
            })
            .addCase(downloadingWaterBenderForecastAsync.fulfilled, (state, action) => {
                console.log('✅ Forecast data loaded successfully:', {
                    predictions: action.payload?.length || 0,
                    hours: action.payload?.length ? `${action.payload.length}h` : 'N/A'
                });
                
                state.isForecastLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.waterBenderForecast = Array.isArray(action.payload) ? action.payload : [];
                state.message = `Forecast data loaded: ${action.payload?.length || 0} predictions`;
                
                // Update forecast cache metadata
                const now = new Date().toISOString();
                state.lastForecastUpdate = now;
                state.forecastCacheExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();
                state.lastUpdated = now;
            })
            .addCase(downloadingWaterBenderForecastAsync.rejected, (state, action) => {
                console.error('❌ Failed to load forecast data:', action.payload);
                
                state.isForecastLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload || 'Failed to load forecast data';
                
                // Keep existing forecast data on error (graceful degradation)
                // state.waterBenderForecast = []; // Don't clear existing data
            });
    },
});

// ===== EXPORTED ACTIONS =====
export const { 
    resetHome, 
    clearErrors, 
    setForecastLoading,
    setInfo, 
    clearInfo, 
    updateLastRefresh,
    updateForecastCache
} = homeSlice.actions;

// ===== SELECTOR FUNCTIONS =====

/**
 * Selector functions for accessing specific parts of home state
 * These provide a clean interface for components to access state
 */

// Basic state selectors
export const selectHomeLoading = (state) => state.home.isLoading;
export const selectForecastLoading = (state) => state.home.isForecastLoading; // New selector
export const selectHomeError = (state) => state.home.isError;
export const selectHomeSuccess = (state) => state.home.isSuccess;
export const selectHomeMessage = (state) => state.home.message;

// Data selectors
export const selectWaterBenderLast = (state) => state.home.waterBenderLast;
export const selectWaterBenderAvg = (state) => state.home.waterBenderAvg;
export const selectWaterBenderMonthly = (state) => state.home.waterBenderMonthly;
export const selectWaterBenderDaily = (state) => state.home.waterBenderDaily;
export const selectWaterBenderForecast = (state) => state.home.waterBenderForecast;

// Performance selectors
export const selectLastForecastUpdate = (state) => state.home.lastForecastUpdate;
export const selectForecastCacheExpiry = (state) => state.home.forecastCacheExpiry;

// Computed selectors
export const selectHasWaterData = (state) => {
    const { waterBenderLast, waterBenderDaily } = state.home;
    return Array.isArray(waterBenderLast) && waterBenderLast.length > 0 ||
           Array.isArray(waterBenderDaily) && waterBenderDaily.length > 0;
};

export const selectIsForecastCacheValid = (state) => {
    const expiry = state.home.forecastCacheExpiry;
    if (!expiry) return false;
    return new Date() < new Date(expiry);
};

export const selectLastUpdated = (state) => state.home.lastUpdated;

// Export reducer as default
export default homeSlice.reducer;