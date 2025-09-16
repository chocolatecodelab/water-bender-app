/**
 * Redux Connection Layer for Dashboard Screen
 * 
 * This file serves as the bridge between the Dashboard component and Redux store,
 * managing state mapping, action dispatching, and authentication flow.
 * 
 * Features:
 * - Authentication state management and redirect logic
 * - Water monitoring data state mapping with performance optimization
 * - Forecast data loading with optimized timing strategy
 * - Date transformation utilities for API compatibility
 * - Enhanced error handling and logging
 * 
 * Performance Optimizations:
 * - Delayed forecast loading to improve perceived performance
 * - Cache validation for forecast data
 * - Selective data loading based on user interaction
 * 
 * @file src/screens/dashboard/ReduxConnect.js
 * @version 2.0.0
 * @author Water Monitoring Team
 */

// ===== CORE REDUX IMPORTS =====
import { connect } from 'react-redux';

// ===== COMPONENT IMPORTS =====
import DashboardScreen from './Dashboard';

// ===== REDUX FEATURE IMPORTS =====
import { 
  downloadingWaterBenderAvgAsync, 
  downloadingWaterBenderLastAsync, 
  downloadingWaterBenderMonthlyAsync, 
  downloadingWaterBenderDailyAsync, 
  downloadingWaterBenderForecastAsync, 
  selectForecastLoading, 
  selectIsForecastCacheValid 
} from '../../redux/features/home/homeSlice';
import { 
  logout, 
  selectIsAuthenticated, 
  selectCurrentUser 
} from '../../redux/features/login/loginSlice';

// ===== UTILITY IMPORTS =====
import moment from 'moment';
import navigationService from '../../tools/navigationService';
import { NAV_NAME_LOGIN } from '../../tools/constant';

// ===== STATE TO PROPS MAPPING =====

/**
 * Maps Redux state to component props
 * 
 * Provides Dashboard component with all necessary data from Redux store
 * including authentication status, water monitoring data, and loading states.
 * 
 * Security Features:
 * - Authentication validation with automatic redirect
 * - User session verification
 * - Secure navigation handling
 * 
 * Performance Features:
 * - Selective data mapping to prevent unnecessary re-renders
 * - Forecast cache validation
 * - Loading state management for better UX
 * 
 * @param {Object} state - Redux store state
 * @returns {Object} Props object for Dashboard component
 */
const mapStateToProps = state => {
    // ===== AUTHENTICATION CHECKS =====
    const isAuthenticated = selectIsAuthenticated(state);
    const currentUser = selectCurrentUser(state);
    const isForecastLoading = selectForecastLoading(state);
    const isForecastCacheValid = selectIsForecastCacheValid(state);
    
    // Security check: If not authenticated, redirect to login
    if (!isAuthenticated || !currentUser) {
        console.log('⚠️ Dashboard accessed without authentication, redirecting to login');
        setTimeout(() => {
            navigationService.reset(NAV_NAME_LOGIN);
        }, 100);
    }
    
    return ({
        // ===== AUTHENTICATION STATE =====
        isAuthenticated,
        currentUser,
        
        // ===== WATER MONITORING DATA STATE =====
        isLoading: state.home.isLoading,
        isForecastLoading, // Specific loading state for forecast
        isSuccess: state.home.isSuccess,
        isError: state.home.isError,
        message: state.home.message,
        
        // ===== WATER SENSOR DATA =====
        waterBenderLast: state.home?.waterBenderLast[0]?.Surface,
        waterBenderAvg: state.home?.waterBenderAvg?.Data?.[0]?.Rata_Rata_Surface ?? 0, // Default to 0 if undefined
        waterBenderAvgDistance: state.home?.waterBenderAvg?.Data?.[0]?.Data ?? 0,
        waterBenderDaily: state.home?.waterBenderDaily,
        waterBenderForecast: state.home?.waterBenderForecast,
        waterBenderMonthly: state.home?.waterBenderMonthly,
        waterBenderPeriod: state.home?.waterBenderAvg.Data,
        
        // ===== PERFORMANCE METADATA =====
        isForecastCacheValid,
        lastForecastUpdate: state.home.lastForecastUpdate,
        forecastCacheExpiry: state.home.forecastCacheExpiry,
    })
};

// ===== DISPATCH TO PROPS MAPPING =====

/**
 * Maps Redux actions to component props
 * 
 * Provides Dashboard component with action dispatchers for data loading,
 * user interaction handling, and navigation management.
 * 
 * Features:
 * - Optimized data loading sequence
 * - Date transformation for API compatibility
 * - Performance-optimized forecast loading
 * - Error handling and logging
 * - Secure logout functionality
 * 
 * @param {Function} dispatch - Redux dispatch function
 * @returns {Object} Action dispatchers object for Dashboard component
 */
const mapDispatchToProps = (dispatch) => ({
    /**
     * OPTIMIZED: Smart dashboard data loading
     * 
     * Menggunakan conditional loading untuk menghindari API call yang tidak perlu.
     * Hanya memuat data yang benar-benar diperlukan berdasarkan kondisi dan cache.
     * 
     * @param {Date} startDate - Start date for data range
     * @param {Date} finishDate - End date for data range
     * @param {Object} loadingFlags - Flags untuk menentukan API mana yang perlu dipanggil
     * @param {boolean} loadingFlags.needsLastData - Perlu load data terakhir
     * @param {boolean} loadingFlags.needsDailyData - Perlu load data harian
     * @param {boolean} loadingFlags.needsMonthlyData - Perlu load data bulanan
     * @param {boolean} loadingFlags.needsForecastData - Perlu load data forecast
     */
    onAppear: (startDate, finishDate, loadingFlags = {}) => {
        // ===== DATE TRANSFORMATION =====
        const today = new Date();
        const transformStartDate = startDate 
            ? `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}` 
            : `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        const transformFinishDate = finishDate 
            ? `${finishDate.getFullYear()}-${finishDate.getMonth() + 1}-${finishDate.getDate()}` 
            : `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        
        const params = { 
            startDate: transformStartDate, 
            endDate: transformFinishDate 
        };
        const year = moment(startDate).format('YYYY');
        
        console.log('🎯 OPTIMIZED API Loading with smart flags:', {
            params,
            year,
            loadingFlags
        });
        
        // ===== CONDITIONAL API LOADING =====
        const apiCalls = [];
        
        // SELALU LOAD: Period/Avg data (bergantung pada rentang tanggal)
        console.log('📊 Loading period/avg data (date-dependent)');
        apiCalls.push(dispatch(downloadingWaterBenderAvgAsync(params)));
        
        // CONDITIONAL: Last data (hanya jika belum pernah diload)
        if (loadingFlags.needsLastData !== false) {
            console.log('🔄 Loading latest sensor data');
            apiCalls.push(dispatch(downloadingWaterBenderLastAsync()));
        } else {
            console.log('⏭️ Skipping latest data (already cached)');
        }
        
        // CONDITIONAL: Monthly data (hanya jika tahun berbeda)
        if (loadingFlags.needsMonthlyData !== false) {
            console.log('📅 Loading monthly data for year:', year);
            apiCalls.push(dispatch(downloadingWaterBenderMonthlyAsync(year)));
        } else {
            console.log('⏭️ Skipping monthly data (same year cached)');
        }
        
        // OPTIMIZED: Combined daily + forecast loading untuk mengurangi network latency
        if (loadingFlags.needsDailyData !== false) {
            console.log('📈 Loading daily data and forecast (combined)');
            
            // Load daily data immediately  
            apiCalls.push(dispatch(downloadingWaterBenderDailyAsync()));
            
            // PERFORMANCE: Load forecast immediately after daily (no delay)
            // This reduces total loading time and eliminates delay complexity
            if (loadingFlags.needsForecastData !== false) {
                console.log('🔮 Loading forecast data (combined with daily)');
                apiCalls.push(dispatch(downloadingWaterBenderForecastAsync()));
            }
        } else {
            console.log('⏭️ Skipping daily+forecast data (cached or not needed)');
            
            // If daily is cached but forecast needs refresh
            if (loadingFlags.needsForecastData !== false) {
                console.log('🔮 Loading forecast data only');
                apiCalls.push(dispatch(downloadingWaterBenderForecastAsync()));
            }
        }

        console.log(`✅ Smart loading completed: ${apiCalls.length} API calls made instead of 5`);
    },
    
    /**
     * OPTIMIZED: Refresh all data manually
     * 
     * Memaksa reload semua data, mengabaikan cache.
     * Digunakan untuk pull-to-refresh atau manual refresh button.
     */
    onRefreshAllData: (startDate, finishDate) => {
        console.log('🔄 Manual refresh: Force loading all data...');
        
        const today = new Date();
        const transformStartDate = startDate 
            ? `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}` 
            : `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        const transformFinishDate = finishDate 
            ? `${finishDate.getFullYear()}-${finishDate.getMonth() + 1}-${finishDate.getDate()}` 
            : `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        
        const params = { 
            startDate: transformStartDate, 
            endDate: transformFinishDate 
        };
        const year = moment(startDate).format('YYYY');
        
        // OPTIMIZED: Parallel loading untuk mengurangi total loading time
        dispatch(downloadingWaterBenderAvgAsync(params));
        dispatch(downloadingWaterBenderLastAsync());
        dispatch(downloadingWaterBenderMonthlyAsync(year));
        
        // PERFORMANCE: Combined daily+forecast loading tanpa delay
        const dailyPromise = dispatch(downloadingWaterBenderDailyAsync());
        const forecastPromise = dispatch(downloadingWaterBenderForecastAsync());
        
        // Optional: Wait for critical data to complete before UI updates
        // Promise.all([dailyPromise, forecastPromise]).then(() => {
        //     console.log('✅ Critical real-time data loaded');
        // });
    },

    /**
     * Refresh forecast data
     * 
     * Manually refresh forecast data when user requests or cache expires.
     * Used for pull-to-refresh functionality.
     */
    onRefreshForecast: () => {
        console.log('🔄 Refreshing forecast data...');
        dispatch(downloadingWaterBenderForecastAsync(12));
    },
    
    /**
     * Handle error modal close
     * 
     * Cleanup action when user closes error modal.
     * Can be extended to reset error states if needed.
     */
    onCloseModalError: () => {
        // dispatch(resetWaterBender()) // Uncomment if you have this action
        console.log('❌ Error modal closed');
    },
    
    /**
     * Handle user logout
     * 
     * Securely logs out user and navigates to login screen.
     * Uses reset navigation to clear the navigation stack.
     */
    onLogoutPressed: () => {
        console.log('🔓 User logging out...');
        dispatch(logout());
        
        // Use reset instead of navigate to clear navigation stack
        setTimeout(() => {
            navigationService.reset(NAV_NAME_LOGIN);
        }, 100);
    },
});


// ===== REDUX CONNECTION =====

/**
 * Connect Dashboard component to Redux store
 * 
 * Creates a Higher-Order Component (HOC) that connects the Dashboard
 * component to the Redux store, providing it with state and actions.
 * 
 * Benefits:
 * - Automatic re-rendering when relevant state changes
 * - Clean separation of concerns (UI vs State Management)
 * - Optimized performance with shallow equality checks
 * - Type-safe prop injection
 * 
 * @returns {React.ComponentType} Connected Dashboard component
 */
export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
