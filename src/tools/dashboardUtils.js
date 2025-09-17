/**
 * Dashboard Helper Utilities
 * 
 * This module provides utility functions for common dashboard operations
 * including data formatting, validation, and UI helper functions.
 * 
 * @file src/tools/dashboardUtils.js
 * @version 1.0.0
 */

import moment from 'moment';

/**
 * Handle quick filter date selection
 * @param {Date} newStartDate - New start date
 * @param {Date} newFinishDate - New finish date  
 * @param {Function} setStartDate - Start date setter function
 * @param {Function} setFinishDate - Finish date setter function
 * @param {Function} onAppear - Callback function to trigger data reload
 */
export const handleQuickFilterSelect = (
  newStartDate, 
  newFinishDate,
  setStartDate,
  setFinishDate,
  onAppear
) => {
  console.log('📅 Quick filter selected:', {
    startDate: moment(newStartDate).format('YYYY-MM-DD'),
    finishDate: moment(newFinishDate).format('YYYY-MM-DD')
  });
  
  setStartDate(newStartDate);
  setFinishDate(newFinishDate);
  
  // Trigger data reload with new date range
  if (onAppear) {
    onAppear(newStartDate, newFinishDate);
  }
};

/**
 * Handle manual refresh with cache reset
 * @param {Function} resetDataCache - Function to reset data cache
 * @param {Function} onRefreshAllData - Function to refresh all data
 * @param {Date} startDate - Current start date
 * @param {Date} finishDate - Current finish date
 */
export const handleManualRefresh = (
  resetDataCache,
  onRefreshAllData,
  startDate,
  finishDate
) => {
  console.log('🔄 Manual refresh triggered - resetting cache');
  resetDataCache();
  
  // Force refresh all data
  if (onRefreshAllData) {
    onRefreshAllData(startDate, finishDate);
  }
};

/**
 * Format water depth value for display
 * @param {number} value - Water depth value
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted water depth string
 */
export const formatWaterDepth = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return `${value.toFixed(decimals)} cm`;
};

/**
 * Check if data is available and valid
 * @param {any} data - Data to check
 * @returns {boolean} Whether data is available and valid
 */
export const isDataAvailable = (data) => {
  return data && Array.isArray(data) && data.length > 0;
};

/**
 * Get screen orientation description
 * @param {boolean} isLandscape - Whether device is in landscape mode
 * @returns {string} Orientation description
 */
export const getOrientationDescription = (isLandscape) => {
  return isLandscape ? 'landscape' : 'portrait';
};

/**
 * Calculate responsive card spacing based on screen size
 * @param {Object} screenDimensions - Screen dimensions object
 * @param {boolean} isTablet - Whether device is a tablet
 * @returns {number} Spacing value
 */
export const calculateCardSpacing = (screenDimensions, isTablet) => {
  if (isTablet) {
    return 30;
  }
  if (screenDimensions.width < 400) {
    return 10;
  }
  return 20;
};

/**
 * Get appropriate text size based on screen size
 * @param {string} screenSize - Screen size category
 * @param {string} textType - Type of text ('title', 'body', 'caption')
 * @returns {number} Font size
 */
export const getResponsiveTextSize = (screenSize, textType = 'body') => {
  const sizeMap = {
    small: { title: 14, body: 12, caption: 10 },
    medium: { title: 16, body: 14, caption: 12 },
    large: { title: 18, body: 16, caption: 14 },
    xlarge: { title: 20, body: 18, caption: 16 }
  };
  
  return sizeMap[screenSize]?.[textType] || sizeMap.medium[textType];
};