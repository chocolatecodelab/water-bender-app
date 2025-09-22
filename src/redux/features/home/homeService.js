/**
 * Home Service Layer
 * 
 * Service layer for water monitoring data API interactions.
 * Handles all HTTP requests related to water sensor data, forecasting,
 * and historical water level information.
 * 
 * Features:
 * - Real-time sensor data retrieval
 * - Historical data aggregation
 * - Weather forecast integration
 * - Error handling and request validation
 * - URL parameter substitution
 * - Response data transformation
 * 
 * API Endpoints:
 * - Last sensor reading
 * - Average readings for date range  
 * - Daily hourly readings
 * - Monthly aggregated data
 * - Weather forecast predictions
 * 
 * @file src/redux/features/home/homeService.js
 * @version 1.0.0
 */

import { 
    REST_URL_GET_WATER_BENDER,
    REST_URL_GET_AVG_SENSELOG_WATER_BENDER,
    REST_URL_GET_DAILY_SENSELOG_WATER_BENDER, 
    REST_URL_GET_LAST_SENSELOG_WATER_BENDER, 
    REST_URL_GET_MONTHLY_SENSELOG_WATER_BENDER,
    REST_URL_GET_FORECAST_WATER_BENDER
} from "../../../tools/constant";

import { 
    sendGetRequest, 
    sendPostRequest 
} from "../../../tools/helper";

// ===== SERVICE CONFIGURATION =====

/**
 * Service configuration constants
 */
const SERVICE_CONFIG = {
    DEFAULT_FORECAST_HOURS: 12,
    MAX_FORECAST_HOURS: 48,
    MIN_FORECAST_HOURS: 1,
    REQUEST_TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
};

// ===== HELPER FUNCTIONS =====

/**
 * Validate date range parameters
 * Ensures startDate and endDate are valid and logical
 * 
 * @param {Object} params - Date range parameters
 * @param {string} params.startDate - Start date (ISO format)
 * @param {string} params.endDate - End date (ISO format)
 * @throws {Error} If date validation fails
 */
const validateDateRange = (params) => {
    if (!params || typeof params !== 'object') {
        throw new Error('Date parameters are required');
    }

    const { startDate, endDate } = params;

    if (!startDate || !endDate) {
        throw new Error('Both startDate and endDate are required');
    }

    // Validate date format and values
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format. Use ISO date format (YYYY-MM-DD)');
    }

    if (start > end) {
        throw new Error('Start date must be before or equal to end date');
    }

    // Check if date range is reasonable (not more than 1 year)
    const daysDifference = (end - start) / (1000 * 60 * 60 * 24);
    if (daysDifference > 365) {
        throw new Error('Date range cannot exceed 365 days');
    }
};

/**
 * Validate year parameter
 * Ensures year is within acceptable range
 * 
 * @param {string|number} year - Year to validate
 * @returns {number} Validated year as number
 * @throws {Error} If year validation fails
 */
const validateYear = (year) => {
    if (!year) {
        throw new Error('Year parameter is required');
    }

    const yearNum = Number(year);
    if (isNaN(yearNum) || yearNum < 2020 || yearNum > new Date().getFullYear() + 1) {
        throw new Error(`Invalid year: ${year}. Must be between 2020 and ${new Date().getFullYear() + 1}`);
    }

    return yearNum;
};

/**
 * Validate forecast hours parameter
 * Ensures forecast hours is within acceptable range
 * 
 * @param {number} hours - Hours to forecast
 * @returns {number} Validated hours within acceptable range
 */
const validateForecastHours = (hours = SERVICE_CONFIG.DEFAULT_FORECAST_HOURS) => {
    const hoursNum = Number(hours) || SERVICE_CONFIG.DEFAULT_FORECAST_HOURS;
    return Math.max(
        SERVICE_CONFIG.MIN_FORECAST_HOURS,
        Math.min(SERVICE_CONFIG.MAX_FORECAST_HOURS, hoursNum)
    );
};

/**
 * Build URL with parameter substitution
 * Replaces placeholder parameters in URL template
 * 
 * @param {string} urlTemplate - URL template with placeholders
 * @param {Object} params - Parameters to substitute
 * @returns {string} URL with substituted parameters
 */
const buildUrlWithParams = (urlTemplate, params = {}) => {
    let url = urlTemplate;
    
    Object.entries(params).forEach(([key, value]) => {
        const placeholder = new RegExp(`\\{${key}\\}`, 'g');
        url = url.replace(placeholder, encodeURIComponent(value));
    });
    
    return url;
};

/**
 * Generic error handler for service requests
 * Standardizes error handling across all service functions
 * 
 * @param {Error} error - Error object from request
 * @param {string} operation - Description of operation that failed
 * @throws {Error} Standardized error with context
 */
const handleServiceError = (error, operation) => {
    console.error(`❌ Service Error [${operation}]:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        timestamp: new Date().toISOString()
    });

    // Extract meaningful error message
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        `Failed to ${operation.toLowerCase()}`;

    throw new Error(errorMessage);
};

// ===== SERVICE FUNCTIONS =====

/**
 * Fetch average water sensor readings for date range
 * 
 * Retrieves and calculates average water sensor readings within the specified
 * date range. Useful for trending analysis and period comparisons.
 * 
 * @async
 * @function downloadingWaterBenderAvg
 * @param {Object} params - Request parameters
 * @param {string} params.startDate - Start date (ISO format: YYYY-MM-DD)
 * @param {string} params.endDate - End date (ISO format: YYYY-MM-DD)
 * @returns {Promise<Object>} Average sensor data for the specified period
 * @throws {Error} If request fails or parameters are invalid
 * 
 * @example
 * const avgData = await downloadingWaterBenderAvg({
 *   startDate: '2024-01-01',
 *   endDate: '2024-01-31'
 * });
 */
export const downloadingWaterBenderAvg = async (params) => {
    try {
        // Validate input parameters
        validateDateRange(params);

        // Build URL with date parameters
        const url = buildUrlWithParams(REST_URL_GET_AVG_SENSELOG_WATER_BENDER, {
            startDate: params.startDate,
            endDate: params.endDate
        });

        console.log('🔄 Fetching average water data:', {
            dateRange: `${params.startDate} to ${params.endDate}`,
            url: url.replace(/[?&]key=[^&]*/g, '&key=***') // Hide API key in logs
        });

        // Make API request
        const response = await sendGetRequest(url);

        // Validate response structure
        if (!response) {
            throw new Error('No response received from server');
        }

        console.log('✅ Average water data retrieved successfully:', {
            dataPoints: response.Data?.length || 0,
            hasData: !!response.Data
        });

        return response;

    } catch (error) {
        handleServiceError(error, 'Fetch Average Water Data');
    }
};

/**
 * Fetch latest water sensor reading
 * 
 * Retrieves the most recent water sensor reading for real-time monitoring.
 * This is typically used for dashboard displays and current status indicators.
 * 
 * @async
 * @function downloadingWaterBenderLast
 * @returns {Promise<Object>} Latest sensor reading with timestamp
 * @throws {Error} If request fails or no data available
 * 
 * @example
 * const latestReading = await downloadingWaterBenderLast();
 * console.log('Current water level:', latestReading);
 */
export const downloadingWaterBenderLast = async () => {
    try {
        console.log('🔄 Fetching latest water sensor reading...');

        // Make API request
        const response = await sendGetRequest(REST_URL_GET_LAST_SENSELOG_WATER_BENDER);

        // Validate response
        if (!response?.Data) {
            throw new Error('No sensor data available');
        }

        console.log('✅ Latest water sensor data retrieved:', {
            timestamp: response.Data.timestamp || 'Not specified',
            hasReading: !!response.Data.value || !!response.Data.Surface
        });

        return response.Data;

    } catch (error) {
        handleServiceError(error, 'Fetch Latest Water Reading');
    }
};

/**
 * Fetch monthly aggregated water sensor data
 * 
 * Retrieves monthly statistics and aggregated water sensor data for the
 * specified year. Useful for yearly trends and seasonal analysis.
 * 
 * @async
 * @function downloadingWaterBenderMonthly
 * @param {string|number} year - Target year for monthly data
 * @returns {Promise<Array>} Array of monthly aggregated data
 * @throws {Error} If request fails or year is invalid
 * 
 * @example
 * const monthlyData = await downloadingWaterBenderMonthly(2024);
 * console.log('Monthly trends:', monthlyData);
 */
export const downloadingWaterBenderMonthly = async (year) => {
    try {
        // Validate and sanitize year parameter
        const validatedYear = validateYear(year);

        // Build URL with year parameter
        const url = buildUrlWithParams(REST_URL_GET_MONTHLY_SENSELOG_WATER_BENDER, {
            year: validatedYear
        });

        console.log('🔄 Fetching monthly water data:', {
            year: validatedYear,
            endpoint: 'monthly_senselog'
        });

        // Make API request
        const response = await sendGetRequest(url);

        // Validate response
        if (!response?.Data) {
            throw new Error(`No monthly data available for year ${validatedYear}`);
        }

        console.log('✅ Monthly water data retrieved successfully:', {
            year: validatedYear,
            months: response.Data.length || 0
        });

        return response.Data;

    } catch (error) {
        handleServiceError(error, `Fetch Monthly Water Data for ${year}`);
    }
};

/**
 * Fetch daily water sensor readings
 * 
 * Retrieves hourly water sensor readings for the current day.
 * Provides detailed daily patterns and hourly variations.
 * 
 * @async
 * @function downloadingWaterBenderDaily
 * @returns {Promise<Array>} Array of hourly readings for current day
 * @throws {Error} If request fails or no data available
 * 
 * @example
 * const dailyReadings = await downloadingWaterBenderDaily();
 * console.log('Today\'s hourly readings:', dailyReadings);
 */
export const downloadingWaterBenderDaily = async () => {
    try {
        console.log('🔄 Fetching daily water sensor readings:', {
            date: new Date().toISOString().split('T')[0],
            endpoint: 'daily_senselog'
        });

        // Make API request
        const response = await sendGetRequest(REST_URL_GET_DAILY_SENSELOG_WATER_BENDER);

        // Validate response
        if (!response?.Data) {
            throw new Error('No daily sensor data available');
        }

        console.log('✅ Daily water sensor data retrieved:', {
            readings: response.Data.length || 0,
            date: new Date().toISOString().split('T')[0]
        });

        return response.Data;

    } catch (error) {
        handleServiceError(error, 'Fetch Daily Water Readings');
    }
};

/**
 * Fetch water level forecast predictions (OPTIMIZED)
 * 
 * Retrieves weather-based water level predictions for the specified
 * number of hours ahead with performance optimizations.
 * 
 * @async
 * @function downloadingWaterBenderForecast
 * @param {number} [hours=12] - Number of hours to forecast (1-48)
 * @returns {Promise<Array>} Array of forecast predictions
 * @throws {Error} If request fails or parameters are invalid
 * 
 * @example
 * // Get 12-hour forecast (default)
 * const forecast = await downloadingWaterBenderForecast();
 * 
 * // Get 24-hour forecast
 * const extendedForecast = await downloadingWaterBenderForecast(24);
 */
export const downloadingWaterBenderForecast = async (hours = 48) => {
    try {
        // Validate and sanitize forecast hours
        const validatedHours = validateForecastHours(hours);

        console.log('⏱️ Forecast API Request');
        console.log('� Fetching water level forecast (optimized):', {
            hours: validatedHours,
            endpoint: 'forecast_water_bender',
            priority: 'high-performance'
        });

        // Make API request dengan timeout yang lebih pendek untuk forecast
        const response = await sendGetRequest(REST_URL_GET_FORECAST_WATER_BENDER, {
            timeout: 15000, // 15 seconds instead of 30
            priority: 'high'
        });

        console.log('⏱️ Forecast API Request');

        // Validate response
        if (!response?.Data) {
            throw new Error('No forecast data available');
        }

        // Pre-process and filter forecast data untuk performance
        let forecastData = Array.isArray(response.Data) ? response.Data : [];
        
        if (forecastData.length > validatedHours) {
            // Sort by jam first untuk ensure proper order
            forecastData = forecastData
                .sort((a, b) => new Date(a.Tanggal) - new Date(b.Tanggal) || a.Jam - b.Jam)
                .slice(0, validatedHours);
            
            console.log(`⚡ Forecast data pre-filtered to ${validatedHours} hours for performance`);
        }

        // Validate data structure untuk prevent chart issues
        const validatedData = forecastData.filter(item => {
            const hasRequiredFields = item && 
                typeof item.Jam === 'number' && 
                typeof item.Surface === 'number' && 
                item.Tanggal;
            
            if (!hasRequiredFields) {
                console.warn('⚠️ Invalid forecast item filtered out:', item);
            }
            
            return hasRequiredFields;
        });

        console.log('✅ Water level forecast retrieved successfully (optimized):', {
            requestedHours: validatedHours,
            rawPredictions: forecastData.length,
            validPredictions: validatedData.length,
            forecastRange: validatedData.length > 0 ? 
                `${validatedData[0].Tanggal} to ${validatedData[validatedData.length - 1].Tanggal}` : 
                'No valid data',
            dataQuality: `${((validatedData.length / forecastData.length) * 100).toFixed(1)}%`
        });

        return validatedData;

    } catch (error) {
        handleServiceError(error, `Fetch Water Level Forecast (${hours}h)`);
    }
};

// ===== UTILITY EXPORTS =====

/**
 * Service utilities for external use
 * Useful for testing and advanced implementations
 */
export const serviceUtils = {
    validateDateRange,
    validateYear,
    validateForecastHours,
    buildUrlWithParams,
    SERVICE_CONFIG
};

/**
 * Health check function
 * Tests basic connectivity to the water monitoring API
 * 
 * @async
 * @function checkServiceHealth
 * @returns {Promise<Object>} Service health status
 */
export const checkServiceHealth = async () => {
    try {
        console.log('🔍 Performing service health check...');
        
        const response = await downloadingWaterBenderLast();
        
        return {
            status: 'healthy',
            message: 'Water monitoring service is operational',
            timestamp: new Date().toISOString(),
            lastReading: !!response
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            message: error.message,
            timestamp: new Date().toISOString(),
            lastReading: false
        };
    }
};