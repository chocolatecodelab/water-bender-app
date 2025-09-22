/**
 * Data Chart Processing Module
 * 
 * Comprehensive utilities for processing and transforming water monitoring data
 * into chart-compatible formats for react-native-gifted-charts.
 * 
 * Features:
 * - Multiple chart data processing methods (Hourly, Period, Monthly)
 * - Real-time forecast data integration without caching
 * - Factory pattern for component creation and memory optimization
 * - Smart data aggregation and sorting algorithms
 * - Responsive label components with conditional rendering
 * 
 * Chart Types Supported:
 * - Method 1: Daily/Hourly chart (24-hour water level data)
 * - Method 2: Period chart (date range with time stamps)
 * - Method 3: Monthly chart (yearly overview by month)
 * 
 * Real-time Optimizations:
 * - No caching for fresh data processing
 * - Direct API data processing for accuracy
 * - Efficient actual + forecast data merging
 * - Smart forecast selection (12 hours after last actual)
 * 
 * @file src/screens/dashboard/dataChart.js
 * @version 2.1.0
 * @author Water Monitoring Team
 */

// ===== IMPORTS =====
import moment from 'moment';
import { Text, View } from "react-native";
import { COLOR_GRAY_2, COLOR_PRIMARY, COLOR_MAIN_SECONDARY } from '../../tools/constant';
import { stringMonth } from '../../tools/helper';

// ===== CONSTANTS =====

// Removed cache configuration as caching system is no longer used
// Charts will now always process fresh data for real-time accuracy

// ===== MAIN CHART DATA GENERATION =====

/**
 * Main chart data generation function
 * 
 * Processes raw water monitoring data into chart-compatible format
 * based on specified method (hourly, period, or monthly).
 * 
 * @param {Array} data - Raw water monitoring data array
 * @param {number} method - Chart processing method (1=hourly, 2=period, 3=monthly)
 * @returns {Array} Processed chart data array with components
 * 
 * @example
 * const hourlyData = generateChartData(sensorData, 1);
 * const periodData = generateChartData(rangeData, 2);
 * const monthlyData = generateChartData(yearData, 3);
 */
export const generateChartData = (data, method) => {
  let dates;
  if (method == 1) {
    dates = getDatesInRangeFirstMethod(data);
  } else if (method == 2) {
    dates = getDatesInRangeSecondMethod(data);
  } else if (method == 3) {
    dates = getDatesInRangeThirdMethod(data);
  }
  const result = createDataObject(dates, method);
  return result;
};

// ===== FORECAST DATA INTEGRATION =====

/**
 * OPTIMIZED: Simplified function for combining actual and forecast data
 * 
 * Reduced complexity version that processes data more efficiently.
 * Removes heavy factory pattern and lazy-loaded components for better performance.
 * 
 * Algorithm (OPTIMIZED):
 * 1. Quick actual data processing (removed sorting overhead)
 * 2. Simplified forecast filtering (removed complex validation)
 * 3. Direct component creation (no factory pattern)
 * 4. Single sort operation at end
 * 
 * @param {Array} actualData - Array of actual sensor readings
 * @param {Array} forecastData - Array of forecast predictions
 * @returns {Array} Optimized combined chart data
 */
export const generateDailyChartWithForecast = (actualData, forecastData) => {
  console.log('� OPTIMIZED: Processing actual + forecast data');

  let combinedData = [];

  // Validasi data actual
  if (!actualData || actualData.length === 0) {
    console.log('⚠️ No actual data available');
    return [];
  }

  // 1. OPTIMIZED: Quick actual data processing (no heavy sorting)
  const actualDataPoints = actualData.map((actualItem, index) => {
    const jam = formatHour(actualItem.Jam);
    const value = actualItem.Surface;

    return {
      value: value,
      hour: actualItem.Jam,
      sortOrder: actualItem.Jam, // Keep for sorting compatibility
      label: jam,
      isActual: true,
      isForecast: false,
      dataPointColor: COLOR_MAIN_SECONDARY,
      // FIXED: Enhanced label component with proper positioning for hourly labels
      labelComponent: () => (
        <View style={{ 
          marginLeft: 20, 
          paddingLeft: 5, 
          alignItems: 'center',
          justifyContent: 'flex-start', // Align to top to prevent offset
          minHeight: 20, // Consistent height
          paddingTop: 2 // Small top padding for better positioning
        }}>
          <Text style={{ 
            color: COLOR_GRAY_2, 
            fontSize: 11, // Slightly smaller for better fit
            fontWeight: '500',
            textAlign: 'center',
            lineHeight: 12, // Control line height to prevent offset
            includeFontPadding: false, // Remove extra font padding
            textAlignVertical: 'top', // Align text to top
            marginTop: 0, // No top margin
            paddingTop: 0 // No top padding on text
          }}>
            {jam}
          </Text>
        </View>
      ),
      // ADDED: Tooltip untuk data actual
      dataPointLabelComponent: () => (
        <View style={{
          backgroundColor: COLOR_MAIN_SECONDARY,
          paddingHorizontal: 8,
          paddingVertical: 5,
          borderRadius: 4,
          marginLeft: 10,
        }}>
          <Text style={{ color: 'white', fontSize: 15, textAlign: 'center' }}>{value.toFixed(2)}</Text>
          <Text style={{ color: 'white', fontSize: 8, textAlign: 'center' }}>🔵 Actual</Text>
        </View>
      ),
      dataPointLabelShiftY: -50,
      dataPointLabelShiftX: 0,
      stripHeight: value,
    };
  });

  combinedData = [...actualDataPoints];

  // 2. FIXED: Process forecast data starting AFTER last actual hour
  if (forecastData && forecastData.length > 0) {
    console.log(`🔮 FIXED: Processing ${forecastData.length} forecast data points`);

    // Find last actual hour for proper forecast continuation
    const lastActualHour = Math.max(...actualData.map(item => item.Jam));
    console.log('🕒 Last actual hour found:', lastActualHour);

    // FIXED: Filter forecast data to start after last actual hour
    const filteredForecast = forecastData.filter(forecastItem => {
      // If forecast is same day and same or earlier hour, skip it
      const forecastDate = moment(forecastItem.Tanggal);
      const today = moment();
      
      // If forecast is today and hour <= last actual hour, skip
      if (forecastDate.isSame(today, 'day') && forecastItem.Jam <= lastActualHour) {
        return false;
      }
      
      return true;
    });

    console.log(`📈 Filtered forecast: ${filteredForecast.length} points after hour ${lastActualHour}`);

    // FIXED: Sort forecast by date then by hour for proper sequence
    const sortedForecast = filteredForecast.sort((a, b) => {
      const dateA = moment(a.Tanggal);
      const dateB = moment(b.Tanggal);
      
      if (dateA.isSame(dateB, 'day')) {
        return a.Jam - b.Jam; // Same day, sort by hour
      }
      return dateA.valueOf() - dateB.valueOf(); // Different days, sort by date
    });

    // Take only first 12 forecast points for better performance
    const forecastToUse = sortedForecast.slice(0, 12);

    const forecastDataPoints = forecastToUse.map((forecastItem, index) => {
      const jam = formatHour(forecastItem.Jam);
      const value = forecastItem.Surface;

      // FIXED: Proper date handling for forecast
      const forecastDate = moment(forecastItem.Tanggal);
      const today = moment();
      const isNextDay = !forecastDate.isSame(today, 'day');
      const dateDisplay = forecastDate.format('DD/MM');

      // Enhanced logging untuk debugging pergantian hari
      if (index < 5) { // Log pertama 5 untuk debug
        console.log(`🔮 Forecast ${index + 1}: ${jam} on ${dateDisplay}, isNextDay: ${isNextDay}`);
      }

      return {
        value: value,
        hour: forecastItem.Jam,
        sortOrder: 1000 + index, // FIXED: Proper ordering after actual data
        label: jam,
        isActual: false,
        isForecast: true,
        dataPointColor: COLOR_PRIMARY,
        forecastDate: dateDisplay,
        isNextDay: isNextDay,
        // FIXED: Enhanced label component with proper positioning for forecast labels
        labelComponent: () => (
          <View style={{ 
            marginLeft: 30, 
            alignItems: 'center',
            justifyContent: 'flex-start', // Align to top
            minHeight: 30, // Slightly taller for forecast with date
            paddingTop: 2
          }}>
            <Text style={{ 
              color: COLOR_PRIMARY, 
              fontSize: 11, // Consistent with actual data
              fontStyle: 'italic',
              textAlign: 'center',
              fontWeight: '500',
              lineHeight: 12, // Control line height
              includeFontPadding: false, // Remove extra padding
              textAlignVertical: 'top',
              marginTop: 0,
              paddingTop: 0
            }}>
              {jam}
            </Text>
            {isNextDay && (
              <Text style={{ 
                color: COLOR_PRIMARY, 
                fontSize: 9, 
                fontStyle: 'italic',
                textAlign: 'center',
                marginTop: 1, // Smaller gap between hour and date
                lineHeight: 10, // Control line height for date
                includeFontPadding: false
              }}>
               {dateDisplay}
              </Text>
            )}
          </View>
        ),
        // FIXED: Enhanced tooltip with proper date info for next day
        dataPointLabelComponent: () => (
          <View style={{
            backgroundColor: COLOR_PRIMARY,
            paddingHorizontal: 6,
            paddingVertical: 5,
            borderRadius: 4,
            marginLeft: 10,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.3)',
            borderStyle: 'dashed',
          }}>
            <Text style={{ color: 'white', fontSize: 15, textAlign: 'center' }}>{value.toFixed(2)}</Text>
            <Text style={{ color: 'white', fontSize: 8, textAlign: 'center' }}>🔺 Forecast</Text>
            {isNextDay && (
              <Text style={{ color: 'white', fontSize: 7, textAlign: 'center', marginTop: 2 }}>
                {dateDisplay}
              </Text>
            )}
          </View>
        ),
        dataPointLabelShiftY: -50,
        dataPointLabelShiftX: 0,
        stripHeight: value,
      };
    });

    combinedData = [...combinedData, ...forecastDataPoints];
    console.log(`✅ OPTIMIZED: Added ${forecastDataPoints.length} forecast points`);
  }

  // 3. OPTIMIZED: Single sort operation
  combinedData.sort((a, b) => a.sortOrder - b.sortOrder);

  console.log('� OPTIMIZED: Combined chart data summary:', {
    total: combinedData.length,
    actual: combinedData.filter(d => d.isActual).length,
    forecast: combinedData.filter(d => d.isForecast).length
  });

  return combinedData;
};

// ===== COMPONENT FACTORY FUNCTIONS (OPTIMIZED) =====

/**
 * OPTIMIZED: Simplified component creation
 * 
 * Factory functions have been optimized and simplified for better performance.
 * Direct component creation is now used instead of complex factory pattern.
 * This reduces memory overhead and improves rendering performance.
 * 
 * Note: Components are now created directly in the data processing functions
 * to eliminate the overhead of lazy-loaded factory pattern.
 */

// Factory functions removed - components are now created directly in generateDailyChartWithForecast
// This eliminates memory overhead and improves performance significantly

// ===== CACHE MANAGEMENT =====

/**
 * Cache management functions removed
 * 
 * Caching system has been removed to ensure real-time data processing.
 * Charts will now always use fresh data from API for accurate monitoring.
 * This provides better user experience with up-to-date water level information.
 * 
 * @deprecated Cache functionality removed for real-time accuracy
 */

// ===== CHART STYLING UTILITIES =====

/**
 * Generate line segment colors for multi-colored chart lines
 * 
 * Creates color array for chart line segments to visually distinguish
 * between actual sensor data (red) and forecast predictions (blue).
 * 
 * Algorithm:
 * - Actual → Actual segments: COLOR_MAIN_SECONDARY (red)
 * - Forecast → Forecast segments: COLOR_PRIMARY (blue)  
 * - Actual → Forecast transitions: COLOR_PRIMARY (blue)
 * - Forecast → Actual transitions: COLOR_MAIN_SECONDARY (red, fallback)
 * 
 * @param {Array} data - Chart data array with isActual/isForecast flags
 * @returns {Array} Color array for line segments
 * 
 * @example
 * const lineColors = getLineSegmentColors(chartData);
 * // ['#DD5746', '#DD5746', '#03AED2', '#03AED2', ...]
 */
export const getLineSegmentColors = (data) => {
  if (!data || data.length === 0) return [];

  let colors = [];
  for (let i = 0; i < data.length - 1; i++) {
    const currentPoint = data[i];
    const nextPoint = data[i + 1];

    // Jika kedua point adalah actual, gunakan warna actual
    if (currentPoint.isActual && nextPoint.isActual) {
      colors.push(COLOR_MAIN_SECONDARY);
    }
    // Jika kedua point adalah forecast, gunakan warna forecast
    else if (currentPoint.isForecast && nextPoint.isForecast) {
      colors.push(COLOR_PRIMARY);
    }
    // Jika transisi dari actual ke forecast, gunakan warna forecast
    else if (currentPoint.isActual && nextPoint.isForecast) {
      colors.push(COLOR_PRIMARY); // Transisi ke forecast
    }
    // Jika transisi dari forecast ke actual (edge case)
    else {
      colors.push(COLOR_MAIN_SECONDARY); // Fallback ke actual
    }
  }

  return colors;
};

/**
 * Generate segmented area fill colors for chart background
 * 
 * Creates color configuration for chart area fill that distinguishes
 * between actual data areas and forecast prediction areas with
 * appropriate opacity and transitions.
 * 
 * Features:
 * - Dynamic start/end fill colors based on data composition
 * - Per-segment area coloring for mixed actual/forecast data
 * - Opacity-based visual hierarchy (actual > forecast)
 * - Smooth color transitions at data boundaries
 * 
 * @param {Array} data - Chart data array with isActual/isForecast flags
 * @returns {Object} Area fill configuration object
 * @returns {string} returns.startFillColor - Primary fill color
 * @returns {string} returns.endFillColor - Gradient end color
 * @returns {Array} returns.areaFillColors - Per-segment color array
 * 
 * @example
 * const areaConfig = getSegmentedAreaColors(chartData);
 * const { startFillColor, endFillColor, areaFillColors } = areaConfig;
 */
export const getSegmentedAreaColors = (data) => {
  if (!data || data.length === 0) return {
    startFillColor: COLOR_MAIN_SECONDARY,
    endFillColor: `${COLOR_MAIN_SECONDARY}30`, // 30 = opacity 0.19 in hex
    areaFillColors: []
  };

  // Buat array warna untuk setiap area segment
  const areaColors = [];
  const actualColor = COLOR_MAIN_SECONDARY;
  const forecastColor = COLOR_PRIMARY;

  for (let i = 0; i < data.length - 1; i++) {
    const currentPoint = data[i];
    const nextPoint = data[i + 1];

    // Tentukan warna area berdasarkan jenis data
    if (currentPoint.isActual && nextPoint.isActual) {
      // Area actual: merah dengan opacity
      areaColors.push(`${actualColor}50`); // 50 = opacity ~0.31
    } else if (currentPoint.isForecast && nextPoint.isForecast) {
      // Area forecast: biru dengan opacity  
      areaColors.push(`${forecastColor}50`); // 50 = opacity ~0.31
    } else {
      // Area transisi: gunakan gradient atau warna campuran
      areaColors.push(`${forecastColor}30`); // Lebih transparan untuk transisi
    }
  }

  // Tentukan warna dominan untuk startFillColor dan endFillColor
  const actualCount = data.filter(d => d.isActual).length;
  const forecastCount = data.filter(d => d.isForecast).length;

  let startColor, endColor;
  if (actualCount > forecastCount) {
    startColor = actualColor;
    endColor = `${actualColor}20`;
  } else if (forecastCount > actualCount) {
    startColor = forecastColor;
    endColor = `${forecastColor}20`;
  } else {
    // Mixed data: start dengan actual, end dengan forecast
    startColor = actualColor;
    endColor = `${forecastColor}20`;
  }

  return {
    startFillColor: startColor,
    endFillColor: endColor,
    areaFillColors: areaColors
  };
};

/**
 * Generate data point line colors for individual data points
 * 
 * Creates color array for individual chart data points to match
 * the visual distinction between actual and forecast data.
 * 
 * @param {Array} data - Chart data array with isForecast flags
 * @returns {Array} Color array for individual data points
 * 
 * @example
 * const pointColors = getDataPointLineColors(chartData);
 * // ['#DD5746', '#DD5746', '#03AED2', '#03AED2', ...]
 */
export const getDataPointLineColors = (data) => {
  if (!data || data.length === 0) return [];

  return data.map(point => {
    return point.isForecast ? COLOR_PRIMARY : COLOR_MAIN_SECONDARY;
  });
};

// ===== FORECAST DATA PROCESSING =====

/**
 * Generate forecast-specific chart data
 * 
 * Processes forecast data for different chart types with specialized
 * formatting and component generation.
 * 
 * @param {Array} forecastData - Raw forecast data array
 * @param {number} method - Chart processing method (1=hourly, 2=period)
 * @returns {Array} Processed forecast chart data
 * 
 * @private
 * @example
 * const forecastChartData = generateForecastChartData(weatherData, 1);
 */
const generateForecastChartData = (forecastData, method) => {
  let dates = {};

  if (method === 1) { // Daily/Hourly forecast
    forecastData.forEach(item => {
      const jam = formatHour(item.Jam);
      const rerataSurface = item.Rata_Rata_Surface;
      dates[jam] = rerataSurface;
    });
  } else if (method === 2) { // Period forecast
    forecastData.forEach(item => {
      const jam = formatHour(item.Jam);
      const tanggal = moment(item.Tanggal).format('DD MMMM YYYY');
      const rerataSurface = item.Rata_Rata_Surface;
      dates[`${tanggal} ${jam}`] = rerataSurface;
    });
  }

  return createForecastDataObject(dates, method);
};

// ===== DATA PROCESSING METHODS =====

/**
 * Process hourly/daily data - Method 1
 * 
 * Transforms raw hourly sensor data into time-keyed object format
 * suitable for daily/hourly chart visualization. Handles both
 * Surface and Rata_Rata_Surface data formats.
 * 
 * @param {Array} data - Array of hourly sensor readings
 * @returns {Object} Time-keyed data object {HH:MM: value, ...}
 * 
 * @example
 * const hourlyData = getDatesInRangeFirstMethod([
 *   { Jam: 8, Surface: 15.5 },
 *   { Jam: 9, Rata_Rata_Surface: 16.2 }
 * ]);
 * // Result: { "08:00": 15.5, "09:00": 16.2 }
 */
const getDatesInRangeFirstMethod = (data) => {
  let jam;
  let rerataSurface;
  let dates = {};
  data.forEach(item => {
    jam = formatHour(item.Jam);
    // Support kedua format data: Surface dan Rata_Rata_Surface
    rerataSurface = item.Surface || item.Rata_Rata_Surface;
    dates[jam] = rerataSurface;
  })
  return dates;
}

/**
 * Process period/range data with timestamps - Method 2
 * 
 * Merges and sorts multi-day sensor data with timestamp information
 * for period-based chart visualization. Combines data arrays from
 * multiple sources and creates datetime-keyed object.
 * 
 * Features:
 * - Multi-source data merging and deduplication
 * - Chronological sorting by date and time
 * - Combined datetime key format: "DD MMMM YYYY HH:MM"
 * 
 * @param {Array} data - Array of data sources with nested Data arrays
 * @returns {Object} Datetime-keyed data object
 * 
 * @example
 * const periodData = getDatesInRangeSecondMethod([
 *   { Data: [{ Tanggal: '2024-08-27', Jam: 8, Rata_Rata_Surface: 15.5 }] }
 * ]);
 * // Result: { "27 August 2024 08:00": 15.5 }
 */
const getDatesInRangeSecondMethod = (data) => {
  const mergeAndSortData = (data) => {
    // Menggabungkan semua data menjadi satu array
    const combinedData = data.reduce((acc, item) => {
      return acc.concat(item.Data);
    }, []);

    // Mengurutkan data berdasarkan Tanggal
    const sortedData = combinedData.sort((a, b) => new Date(a.Tanggal) - new Date(b.Tanggal));
    return sortedData;
  }

  const mergedData = mergeAndSortData(data);
  let jam;
  let tanggal;
  let rerataSurface;
  let dates = {};
  mergedData.forEach(item => {
    jam = formatHour(item.Jam);
    tanggal = (moment(item.Tanggal).format('DD MMMM YYYY'));
    rerataSurface = item.Rata_Rata_Surface;
    // Format dengan jam: "27 August 2025 00:00"
    dates[`${tanggal} ${jam}`] = rerataSurface;
  })
  return dates;
}

/**
 * Process monthly aggregated data - Method 3
 * 
 * Transforms yearly water monitoring data into month-keyed format
 * for monthly trend visualization. Sorts data by month number and
 * uses localized month names.
 * 
 * @param {Array} data - Array of monthly aggregated data
 * @param {number} data[].Bln - Month number (1-12)
 * @param {number} data[].MonthTrans - Monthly average value
 * @returns {Object} Month-keyed data object
 * 
 * @example
 * const monthlyData = getDatesInRangeThirdMethod([
 *   { Bln: 8, MonthTrans: 15.5 },
 *   { Bln: 9, MonthTrans: 16.2 }
 * ]);
 * // Result: { "August": 15.5, "September": 16.2 }
 */
const getDatesInRangeThirdMethod = (data) => {
  let Bln;
  let monthSurface;
  let dates = {};

  let processDate = data.map(item => ({
    Bln: item.Bln,
    MonthTrans: item.MonthTrans
  }));

  // Mengurutkan array berdasarkan urutan bulan
  const sortArray = processDate.sort((a, b) => a.Bln - b.Bln);

  sortArray.forEach(item => {
    Bln = getMonthName(item.Bln);
    monthSurface = item.MonthTrans;
    dates[Bln] = monthSurface;
  })

  return dates; // Mengembalikan objek dates yang sudah diurutkan
}

// ===== HELPER UTILITIES =====

/**
 * Get localized month name by month number
 * 
 * Converts numerical month (1-12) to localized month name string
 * using imported stringMonth array.
 * 
 * @param {number} monthNumber - Month number (1-12)
 * @returns {string} Localized month name
 * 
 * @example
 * const monthName = getMonthName(8); // "August"
 */
const getMonthName = (monthNumber) => {
  // Array indexes start at 0, so subtract 1 from the monthNumber
  return stringMonth[monthNumber - 1];
};

/**
 * Aggregate and sort data by key
 * 
 * Processes data object by sorting entries chronologically and
 * aggregating values with identical keys. Handles date-based
 * sorting for time series data.
 * 
 * @param {Object} data - Data object with string keys and numeric values
 * @returns {Object} Aggregated and sorted data object
 * 
 * @example
 * const aggregated = aggregateDataByKey({
 *   "01 Jan 2024 08:00": 15.5,
 *   "01 Jan 2024 09:00": 16.2
 * });
 */
const aggregateDataByKey = (data) => {
  // Mengonversi objek dates menjadi array
  const datesArray = Object.entries(data);

  // Mengurutkan array secara terbalik
  datesArray.sort((a, b) => new Date(a[0]) - new Date(b[0]));

  // Mengonversi kembali array yang sudah diurutkan menjadi objek
  const sortedDates = Object.fromEntries(datesArray);
  const aggregatedData = {};

  Object.entries(sortedDates).forEach(([key, value]) => {
    if (aggregatedData[key]) {
      aggregatedData[key] += value;
    } else {
      aggregatedData[key] = value;
    }
  });

  return aggregatedData;
};

/**
 * Format hour number to HH:MM string format
 * 
 * Converts numeric hour (0-23) to standardized time string
 * with leading zero padding and ":00" minutes suffix.
 * 
 * @param {number} hour - Hour number (0-23)
 * @returns {string} Formatted time string (HH:MM)
 * 
 * @example
 * const timeString = formatHour(8); // "08:00"
 * const timeString = formatHour(14); // "14:00"
 */
const formatHour = (hour) => {
  // Convert the hour to a string and pad with leading zero if necessary
  return `${hour.toString().padStart(2, '0')}:00`;
};

// ===== CHART DATA OBJECT CREATION =====

/**
 * Create chart data objects with visual components
 * 
 * Transforms processed data into chart-compatible objects with
 * interactive components (labels, tooltips) and responsive formatting
 * for different chart types.
 * 
 * Features:
 * - Method-specific label formatting and visibility
 * - Interactive data point tooltips
 * - Responsive text sizing and positioning
 * - Smart date grouping for period charts
 * - Conditional rendering for better UX
 * 
 * @param {Object} date - Processed data object from aggregateDataByKey
 * @param {number} method - Chart type (1=hourly, 2=period, 3=monthly)
 * @returns {Array} Array of chart data objects with components
 * 
 * @example
 * const chartObjects = createDataObject(processedData, 2);
 */
const createDataObject = (date, method) => {
  const aggregatedDates = aggregateDataByKey(date);
  let previousDate = null;

  return Object.entries(aggregatedDates).map(([key, value], index) => {
    // Memisahkan kembali key menjadi tanggal dan jam
    const formattedDate = key;

    let displayLabel = formattedDate;
    let shouldShow = true;
    let extractedHour = null;
    let extractedDate = null;

    // Base data object
    const dataPoint = {
      value,
      label: displayLabel, // Default label
    };

    if (method === 2) {
      // Untuk Period: format singkat agar tidak wrap
      const parts = key.split(' ');
      if (parts.length >= 4) {
        const currentDate = parts[0]; // "27"
        const currentMonth = parts[1]; // "August"  
        const currentYear = parts[2]; // "2025"
        const currentTime = parts[3]; // "00:00"

        // Extract hour from time string untuk pointer config
        const timeParts = currentTime.split(':');
        extractedHour = parseInt(timeParts[0], 10);
        extractedDate = `${currentDate} ${currentMonth} ${currentYear}`;

        // Format lebih singkat: "27 Aug 00:00"
        const shortMonth = currentMonth.substring(0, 3); // "Aug"
        displayLabel = `${currentDate} ${shortMonth}\n${currentTime}`;
        shouldShow = true; // Selalu tampilkan untuk period dengan jam

        // Tambahan data untuk pointer config period
        dataPoint.label = displayLabel; // Label yang akan digunakan untuk deteksi
        dataPoint.periodDate = extractedDate; // Tanggal lengkap untuk pointer
        dataPoint.periodTime = currentTime; // Jam untuk pointer
      }
    } else if (method === 3) {
      // Untuk Monthly: hanya nama bulan, tanpa jam
      displayLabel = formattedDate;
      dataPoint.label = displayLabel;
      dataPoint.chartType = 'monthly'; // Menandai sebagai monthly chart
      // Tidak ada jam untuk monthly chart
    } else {
      // Untuk method lain (daily/hourly), gunakan format original
      const [currentDate, currentMonth] = key.split(' ');
      const jedaFormatDate = `${currentDate} ${currentMonth} `;
      const isSameAsPrevious = previousDate === currentDate;
      previousDate = currentDate;
      displayLabel = method === 2 ? jedaFormatDate : formattedDate;
      shouldShow = method === 2 ? !isSameAsPrevious : true;
      dataPoint.label = displayLabel;
      dataPoint.hour = extractedHour; // Untuk pointer config daily/hourly
    }

    // Tambahkan komponen visual
    dataPoint.labelComponent = () => {
      return (
        <View style={{
          marginLeft: 30,
          display: shouldShow ? "flex" : "none",
          width: method === 2 ? 60 : 'auto', // Fixed width untuk period
          alignItems: 'center'
        }}>
          <Text style={{
            color: COLOR_GRAY_2,
            fontSize: method === 2 ? 10 : 11,
            textAlign: 'center',
            lineHeight: method === 2 ? 10 : 14
          }}>
            {displayLabel}
          </Text>
        </View>
      );
    };

    dataPoint.dataPointLabelComponent = () => {
      return (
        <View
          style={{
            backgroundColor: 'black',
            paddingHorizontal: 8,
            paddingVertical: 5,
            borderRadius: 4,
            marginLeft: 10
          }}>
          <Text style={{ color: 'white', fontSize: 15 }}>{value}</Text>
        </View>
      );
    };

    dataPoint.dataPointLabelShiftY = -40;
    dataPoint.dataPointLabelShiftX = 0;
    dataPoint.stripHeight = value;
    
    // Mark as actual data for filter counting
    dataPoint.isActual = true;

    return dataPoint;
  });
};

/**
 * Create forecast-specific chart data objects
 * 
 * Similar to createDataObject but with forecast-specific styling
 * and visual indicators to distinguish predictions from actual data.
 * 
 * Features:
 * - Forecast-specific color scheme (COLOR_MAIN_SECONDARY)
 * - Italic text styling for visual distinction
 * - "forecast" label in data point tooltips
 * - isForecast flag for downstream processing
 * 
 * @param {Object} date - Processed forecast data object
 * @param {number} method - Chart type (1=hourly, 2=period)
 * @returns {Array} Array of forecast chart data objects
 * 
 * @example
 * const forecastObjects = createForecastDataObject(forecastData, 1);
 */
const createForecastDataObject = (date, method) => {
  const aggregatedDates = aggregateDataByKey(date);
  let previousDate = null;

  return Object.entries(aggregatedDates).map(([key, value], index) => {
    const formattedDate = key;
    const [currentDate, currentMonth] = key.split(' ');
    const jedaFormatDate = `${currentDate} ${currentMonth} `
    const isSameAsPrevious = previousDate === currentDate;
    previousDate = currentDate;

    return {
      value,
      // Tandai sebagai data forecast
      isForecast: true,
      labelComponent: () => {
        return (
          <View style={{ marginLeft: 30, display: method === 2 && isSameAsPrevious ? "none" : "flex" }}>
            <Text style={{
              color: COLOR_MAIN_SECONDARY, // Warna berbeda untuk forecast
              fontSize: 12,
              fontStyle: 'italic' // Italic untuk forecast
            }}>
              {method === 2 ? jedaFormatDate : formattedDate}
            </Text>
          </View>
        );
      },
      dataPointLabelComponent: () => {
        return (
          <View
            style={{
              backgroundColor: COLOR_MAIN_SECONDARY, // Warna berbeda untuk forecast
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderRadius: 4,
              marginLeft: 10
            }}>
            <Text style={{ color: 'white', fontSize: 15 }}>{value}</Text>
            <Text style={{ color: 'white', fontSize: 10, textAlign: 'center' }}>forecast</Text>
          </View>
        );
      },
      dataPointLabelShiftY: -50,
      dataPointLabelShiftX: 0,
      stripHeight: value,
    };
  });
};

