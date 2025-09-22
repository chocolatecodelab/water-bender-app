/**
 * Cache Management Utilities
 * 
 * This module provides utility functions for managing data cache state
 * in the water monitoring dashboard application.
 * 
 * @file src/tools/cacheUtils.js
 * @version 1.0.0
 */

/**
 * Create default cache state object
 * @returns {Object} Default cache state
 */
export const createDefaultCacheState = () => ({
  lastLoaded: null,
  dailyLoaded: false,
  monthlyYear: null,
  forecastLoaded: false
});

/**
 * Reset cache state to default values
 * @param {Function} setDataCache - Cache state setter function
 */
export const resetDataCache = (setDataCache) => {
  console.log('🔄 Resetting data cache for fresh reload');
  setDataCache(createDefaultCacheState());
};

/**
 * Update cache state for specific data type
 * @param {Function} setDataCache - Cache state setter function
 * @param {string} dataType - Type of data ('daily', 'monthly', 'forecast', 'last')
 * @param {any} value - Value to set for the data type
 */
export const updateCacheState = (setDataCache, dataType, value) => {
  setDataCache(prev => ({
    ...prev,
    [`${dataType}Loaded`]: value
  }));
};

/**
 * Check if data needs to be loaded based on cache state
 * @param {Object} cacheState - Current cache state
 * @param {string} selectedDate - Selected date string
 * @param {string} currentYear - Current year string
 * @param {string} today - Today's date string
 * @returns {Object} Object indicating which data needs loading
 */
export const checkDataLoadingNeeds = (cacheState, selectedDate, currentYear, today) => {
  return {
    needsLastData: !cacheState.lastLoaded,
    needsDailyData: !cacheState.dailyLoaded && selectedDate === today,
    needsMonthlyData: cacheState.monthlyYear !== currentYear,
    needsForecastData: !cacheState.forecastLoaded && selectedDate === today
  };
};