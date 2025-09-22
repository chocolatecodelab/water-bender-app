/**
 * Chart Utilities for Water Monitoring
 * 
 * Comprehensive utility functions for creating responsive and interactive
 * water monitoring charts using react-native-gifted-charts.
 * 
 * Features:
 * - Responsive chart sizing based on screen dimensions
 * - Dynamic gradient colors for actual vs forecast data
 * - Smart spacing calculations for optimal data visualization
 * - Custom pointer configurations with rich tooltips
 * - Accessibility-friendly color schemes
 * - Time formatting for different chart types
 * 
 * Chart Types Supported:
 * - Daily/Hourly charts (24-hour format)
 * - Period charts (date range with time)
 * - Monthly charts (yearly overview)
 * - Mixed data charts (actual + forecast)
 * 
 * @file src/tools/chartUtils.js
 * @version 1.0.0
 */

import React from 'react';
import { Dimensions, View, Text } from 'react-native';

// ===== SCREEN UTILITIES =====

/**
 * Get current screen dimensions
 * 
 * Retrieves the current window dimensions for responsive chart sizing.
 * Automatically updates when device orientation changes.
 * 
 * @returns {Object} Screen dimensions object with width and height
 * 
 * @example
 * const { width, height } = getScreenDimension();
 * console.log(`Screen: ${width}x${height}`);
 */
export const getScreenDimension = () => {
  return Dimensions.get('window');
};

// ===== COLOR GENERATION =====

/**
 * Generate dynamic gradient colors based on data composition
 * 
 * Analyzes the data composition (actual vs forecast) and returns
 * appropriate gradient colors for chart visualization.
 * 
 * @param {Array} data - Array of data points with isForecast property
 * @returns {Object} Gradient color configuration
 * @property {string} startFillColor - Starting gradient color (RGBA)
 * @property {string} endFillColor - Ending gradient color (RGBA)
 * 
 * @example
 * const colors = getDynamicGradientColors([
 *   { value: 2.5, isForecast: false },
 *   { value: 3.1, isForecast: true }
 * ]);
 * // Returns colors based on actual vs forecast ratio
 */
export const getDynamicGradientColors = (data) => {
  // Default colors for empty or invalid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      startFillColor: 'rgba(221, 87, 70, 0.3)', // Default actual color with opacity
      endFillColor: 'rgba(221, 87, 70, 0.05)'   // Subtle fade effect
    };
  }

  // Count actual vs forecast data points
  const actualCount = data.filter(item => !item.isForecast).length;
  const forecastCount = data.filter(item => item.isForecast).length;
  
  // Choose gradient based on data majority
  if (actualCount >= forecastCount) {
    // Majority actual data - use warm colors (red/orange theme)
    return {
      startFillColor: 'rgba(221, 87, 70, 0.4)', // COLOR_MAIN_SECONDARY with opacity
      endFillColor: 'rgba(221, 87, 70, 0.05)'   // Subtle fade
    };
  } else {
    // Majority forecast data - use cool colors (blue theme)
    return {
      startFillColor: 'rgba(3, 174, 210, 0.4)', // COLOR_PRIMARY with opacity
      endFillColor: 'rgba(3, 174, 210, 0.05)'   // Subtle fade
    };
  }
};

/**
 * Generate gradient colors for mixed data visualization
 * 
 * Creates gradient colors that blend from actual data colors to forecast colors,
 * providing visual continuity in mixed data charts.
 * 
 * @param {Array} data - Array of mixed actual and forecast data points
 * @returns {Object} Mixed gradient color configuration
 * 
 * @example
 * const mixedColors = getMixedGradientColors(combinedData);
 * // Returns gradient that transitions from actual to forecast colors
 */
export const getMixedGradientColors = (data) => {
  // Default blended colors for empty data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      startFillColor: 'rgba(221, 87, 70, 0.3)', // Start with actual color
      endFillColor: 'rgba(3, 174, 210, 0.1)'    // Blend to forecast color
    };
  }

  const actualCount = data.filter(item => !item.isForecast).length;
  const forecastCount = data.filter(item => item.isForecast).length;
  
  if (actualCount > 0 && forecastCount > 0) {
    // Mixed data - create gradient transition
    return {
      startFillColor: 'rgba(221, 87, 70, 0.4)', // Start with actual color (warm)
      endFillColor: 'rgba(3, 174, 210, 0.2)'    // Blend to forecast color (cool)
    };
  } else if (actualCount > 0) {
    // Only actual data - use consistent actual colors
    return {
      startFillColor: 'rgba(221, 87, 70, 0.4)',
      endFillColor: 'rgba(221, 87, 70, 0.05)'
    };
  } else {
    // Only forecast data - use consistent forecast colors
    return {
      startFillColor: 'rgba(3, 174, 210, 0.4)',
      endFillColor: 'rgba(3, 174, 210, 0.05)'
    };
  }
};

// ===== LAYOUT CALCULATIONS =====

/**
 * Calculate dynamic spacing for chart data points
 * 
 * Determines optimal spacing between data points based on screen size
 * and data length to ensure readable and visually appealing charts.
 * 
 * @param {number} dataLength - Number of data points to display
 * @param {number} [minSpacing=40] - Minimum spacing between points (px)
 * @param {number} [maxSpacing=80] - Maximum spacing between points (px)
 * @returns {number} Calculated optimal spacing in pixels
 * 
 * @example
 * const spacing = calculateDynamicSpacing(24, 30, 60); // For 24-hour data
 * // Returns spacing that fits screen width optimally
 */
export const calculateDynamicSpacing = (dataLength, minSpacing = 40, maxSpacing = 80) => {
  const screenWidth = getScreenDimension().width;
  const availableWidth = screenWidth - 120; // Reserve space for margins and Y-axis labels
  
  if (dataLength === 0) return minSpacing;
  
  // Calculate spacing based on available width
  const calculatedSpacing = availableWidth / dataLength;
  
  // Ensure spacing stays within reasonable bounds for readability
  return Math.max(minSpacing, Math.min(maxSpacing, calculatedSpacing));
};

/**
 * Calculate optimal chart width for scrollable charts
 * 
 * Determines the total chart width needed to display all data points
 * with proper spacing, enabling horizontal scrolling when necessary.
 * 
 * @param {number} dataLength - Number of data points
 * @param {number} [spacing=60] - Spacing between data points
 * @returns {number} Calculated chart width in pixels
 * 
 * @example
 * const chartWidth = calculateChartWidth(48, 50); // 48 data points, 50px spacing
 * // Returns width needed for scrollable chart
 */
export const calculateChartWidth = (dataLength, spacing = 60) => {
  const screenWidth = getScreenDimension().width;
  const calculatedWidth = dataLength * spacing + 100; // Add padding for Y-axis labels
  
  // Return at least screen width for non-scrollable charts,
  // or calculated width for scrollable charts when data exceeds screen
  return Math.max(screenWidth - 40, calculatedWidth);
};

/**
 * Calculate dynamic maximum value for Y-axis
 * 
 * Analyzes data values and determines appropriate Y-axis maximum
 * with padding for better visualization and readability.
 * 
 * @param {Array} data - Array of data points with value property
 * @param {number} [paddingPercent=0.2] - Padding above max value (0.2 = 20%)
 * @returns {number} Calculated maximum Y-axis value
 * 
 * @example
 * const maxY = calculateMaxValue([{value: 2.5}, {value: 4.1}], 0.25);
 * // Returns ~5.1 (4.1 * 1.25, rounded up)
 */
export const calculateMaxValue = (data, paddingPercent = 0.2) => {
  if (!data || data.length === 0) return 5; // Default maximum for empty data
  
  // Find the maximum value in the dataset
  const maxValue = Math.max(...data.map(item => item.value || 0));
  
  // Add percentage-based padding for better visualization
  return Math.ceil(maxValue * (1 + paddingPercent));
};

/**
 * Generate color array for individual data points
 * 
 * Creates an array of colors corresponding to each data point,
 * differentiating between actual and forecast data visually.
 * 
 * @param {Array} data - Array of data points with isForecast property
 * @returns {Array} Array of color strings for each data point
 * 
 * @example
 * const colors = getDataPointColors([
 *   { value: 2.5, isForecast: false },
 *   { value: 3.1, isForecast: true }
 * ]);
 * // Returns ['rgb(221, 87, 70)', '#006DFF']
 */
export const getDataPointColors = (data) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(item => 
    item.isForecast 
      ? '#006DFF'              // Blue for forecast data
      : 'rgb(221, 87, 70)'     // Red/orange for actual data
  );
};

// ===== CHART CONFIGURATION =====

/**
 * Predefined chart configuration presets
 * 
 * Contains reusable configuration objects for different chart types
 * with optimized settings for performance and user experience.
 */
export const chartPresets = {
  /**
   * Responsive chart configuration
   * Optimized for mobile devices with smooth animations
   */
  responsive: {
    // Line appearance
    curved: false,                    // Straight lines for data accuracy
    thickness: 3,                     // Line thickness for visibility
    
    // Data point styling
    dataPointsRadius: 5,              // Point size for touch targets
    dataPointsWidth: 2,               // Point border width
    hideDataPoints: false,            // Always show data points
    
    // Interaction settings
    focusEnabled: true,               // Enable point focusing
    showDataPointLabelOnFocus: true,  // Show labels on touch
    showStripOnFocus: true,           // Show vertical line on focus
    
    // Animation configuration
    isAnimated: true,                 // Enable smooth animations
    animationDuration: 1500,          // Animation duration in ms
    animateOnDataChange: true,        // Animate when data updates
    
    // Grid and axis styling
    rulesType: "solid",               // Grid line style
    rulesColor: "rgba(0,0,0,0.05)",   // Subtle grid lines
    showVerticalLines: true,          // Show vertical grid
    verticalLinesColor: "rgba(0,0,0,0.05)", // Subtle vertical lines
    
    // Axis configuration
    xAxisThickness: 2,                // X-axis line thickness
    yAxisThickness: 2,                // Y-axis line thickness
    xAxisColor: 'rgba(0,0,0,0.1)',    // X-axis color
    yAxisColor: 'rgba(0,0,0,0.1)',    // Y-axis color
  },
  
  /**
   * Color palette for different data types
   */
  colors: {
    actual: '#DD5746',                      // COLOR_MAIN_SECONDARY for actual data
    forecast: '#03AED2',                    // COLOR_PRIMARY for forecast data
    actualArea: 'rgba(221, 87, 70, 0.3)',   // Gradient for actual data area
    forecastArea: 'rgba(3, 174, 210, 0.3)', // Gradient for forecast data area
    strip: 'rgba(3, 174, 210, 0.1)',       // Focus strip color
    grid: 'rgba(0,0,0,0.05)',              // Grid line color
  }
};

// ===== TIME FORMATTING =====

/**
 * Format hour number to readable time string
 * 
 * Converts 24-hour format numbers to user-friendly AM/PM time strings
 * for better readability in chart labels.
 * 
 * @param {number} hour - Hour in 24-hour format (0-23)
 * @returns {string} Formatted time string with AM/PM
 * 
 * @example
 * formatHourDisplay(0)   // Returns "12:00 AM"
 * formatHourDisplay(13)  // Returns "1:00 PM"
 * formatHourDisplay(12)  // Returns "12:00 PM"
 */
export const formatHourDisplay = (hour) => {
  if (hour === 0) return '12:00 AM';      // Midnight
  if (hour === 12) return '12:00 PM';     // Noon
  if (hour < 12) return `${hour}:00 AM`;  // Morning hours
  return `${hour - 12}:00 PM`;            // Afternoon/evening hours
};

// ===== ADVANCED POINTER CONFIGURATION =====

/**
 * Create comprehensive pointer configuration for chart interactivity
 * 
 * Generates advanced tooltip configurations with rich data display,
 * automatic chart type detection, and responsive layout.
 * 
 * @param {Object} colors - Color palette object for styling
 * @param {string} [chartType='daily'] - Expected chart type hint
 * @returns {Object} Complete pointer configuration object
 * 
 * @example
 * const pointerConfig = createPointerConfig(chartPresets.colors, 'monthly');
 * // Returns configuration optimized for monthly charts
 */
export const createPointerConfig = (colors, chartType = 'daily') => ({
  // Pointer styling
  pointer1Color: colors.actual,         // Color for actual data pointer
  pointer2Color: colors.forecast,       // Color for forecast data pointer
  radius: 6,                           // Pointer circle radius
  
  // Tooltip dimensions (responsive based on chart type)
  pointerLabelWidth: 120,              // Fixed width for consistent layout
  pointerLabelHeight: chartType === 'monthly' ? 90 : 120, // Smaller height for monthly
  
  // Interaction settings
  activatePointersOnLongPress: false,  // Activate on tap, not long press
  autoAdjustPointerLabelPosition: true, // Smart positioning to avoid edge clipping
  
  /**
   * Custom pointer label component
   * 
   * Renders rich, context-aware tooltips with automatic chart type detection
   * and appropriate data formatting for different visualization types.
   * 
   * @param {Array} items - Array of data items at the focused point
   * @returns {React.Component} Custom tooltip component
   */
  pointerLabelComponent: (items) => {
    const item = items[0]; // Get the focused data point
    const isActual = !item.isForecast;
    
    // ===== INTELLIGENT CHART TYPE DETECTION =====
    
    let detectedChartType = chartType; // Start with provided hint
    
    // Detect period charts by label format: "DD MMM\nHH:MM"
    if (item.label && item.label.includes('\n') && item.label.includes(':')) {
      detectedChartType = 'period';
    } 
    // Detect monthly charts: no time info, just month names
    else if (item.label && !item.label.includes(':') && !item.hour && !item.time) {
      detectedChartType = 'monthly';
    }
    
    // ===== DYNAMIC TIME AND DATE FORMATTING =====
    
    let timeDisplay = '';
    let dateDisplay = '';
    
    switch (detectedChartType) {
      case 'period':
        // Period charts: extract from "DD MMM\nHH:MM" format
        const labelParts = item.label ? item.label.split('\n') : [];
        if (labelParts.length >= 2) {
          dateDisplay = labelParts[0]; // "27 Aug"
          timeDisplay = labelParts[1]; // "00:00"
        } else if (item.time) {
          timeDisplay = item.time;
        }
        break;
        
      case 'monthly':
        // Monthly charts: only show month label, no time
        dateDisplay = item.label || '';
        timeDisplay = ''; // No time for monthly view
        break;
        
      default:
        // Daily/Hourly charts: show formatted time
        if (item.time) {
          timeDisplay = item.time;
        } else if (item.hour !== null && item.hour !== undefined) {
          timeDisplay = formatHourDisplay(item.hour);
        } else if (item.label && item.label.match(/^\d{1,2}:\d{2}$/)) {
          // ADDED: Extract time from label format "HH:MM" or "H:MM"
          timeDisplay = item.label;
        }
        
        // For daily/hourly charts, typically no separate date display needed
        if (item.date) {
          dateDisplay = item.date;
        }
        break;
    }
    
    // ===== TOOLTIP COMPONENT RENDERING =====
    
    return (
      <View style={{
        // Dynamic height based on chart type
        height: detectedChartType === 'monthly' ? 90 : 120,
        width: 120,
        justifyContent: 'center',
        
        // Styling
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: isActual ? colors.actual : colors.forecast,
        paddingHorizontal: 15,
        paddingVertical: 12,
        
        // Shadow for depth
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
      }}>
        
        {/* Data Type Badge */}
        <View style={{
          backgroundColor: isActual ? colors.actual : colors.forecast,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 6,
          marginBottom: 8,
          alignSelf: 'center'
        }}>
          <Text style={{
            color: 'white',
            fontSize: 10,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            textAlign: 'center'
          }}>
            {detectedChartType === 'monthly' ? 'MONTHLY' : 
             detectedChartType === 'period' ? 'PERIOD' : 
             (isActual ? 'ACTUAL' : 'FORECAST')}
          </Text>
        </View>
        
        {/* Main Value Display */}
        <Text style={{
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 16,
          color: isActual ? colors.actual : colors.forecast,
          marginBottom: 4
        }}>
          {item.value.toFixed(2)} m
        </Text>
        
        {/* Date Display */}
        {dateDisplay && (
          <Text style={{
            textAlign: 'center',
            fontSize: 11,
            color: '#888',
            fontWeight: '500',
            marginBottom: timeDisplay ? 2 : 0
          }}>
            {dateDisplay}
          </Text>
        )}
        
        {/* Time Display */}
        {timeDisplay && (
          <Text style={{
            textAlign: 'center',
            fontSize: 12,
            color: '#666',
            fontWeight: '500'
          }}>
            {timeDisplay}
          </Text>
        )}
      </View>
    );
  },
});

// ===== UTILITY EXPORTS =====

/**
 * Utility functions for advanced chart customization
 * Export commonly used utility functions for external use
 */
export const chartUtilities = {
  getScreenDimension,
  getDynamicGradientColors,
  getMixedGradientColors,
  calculateDynamicSpacing,
  calculateChartWidth,
  calculateMaxValue,
  getDataPointColors,
  formatHourDisplay,
  createPointerConfig,
  chartPresets
};

/**
 * Default export for backward compatibility
 */
export default chartUtilities;
