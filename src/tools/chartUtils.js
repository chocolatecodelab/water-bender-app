import React from 'react';
import { Dimensions, View, Text } from 'react-native';

// Get screen dimensions
export const getScreenDimension = () => {
  return Dimensions.get('window');
};

// Generate dynamic gradient colors based on data composition
export const getDynamicGradientColors = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      startFillColor: 'rgba(221, 87, 70, 0.3)', // Default actual color
      endFillColor: 'rgba(221, 87, 70, 0.05)'
    };
  }

  const actualCount = data.filter(item => !item.isForecast).length;
  const forecastCount = data.filter(item => item.isForecast).length;
  
  // Jika mayoritas data adalah actual
  if (actualCount >= forecastCount) {
    return {
      startFillColor: 'rgba(221, 87, 70, 0.4)', // COLOR_MAIN_SECONDARY with opacity
      endFillColor: 'rgba(221, 87, 70, 0.05)'
    };
  } 
  // Jika mayoritas data adalah forecast
  else {
    return {
      startFillColor: 'rgba(3, 174, 210, 0.4)', // COLOR_PRIMARY with opacity
      endFillColor: 'rgba(3, 174, 210, 0.05)'
    };
  }
};

// Generate gradient for mixed data (actual + forecast)
export const getMixedGradientColors = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      startFillColor: 'rgba(221, 87, 70, 0.3)',
      endFillColor: 'rgba(3, 174, 210, 0.1)' // Blend to forecast color
    };
  }

  const actualCount = data.filter(item => !item.isForecast).length;
  const forecastCount = data.filter(item => item.isForecast).length;
  
  // Jika ada data actual dan forecast, gunakan gradient campuran
  if (actualCount > 0 && forecastCount > 0) {
    return {
      startFillColor: 'rgba(221, 87, 70, 0.4)', // Start with actual color
      endFillColor: 'rgba(3, 174, 210, 0.2)' // Blend to forecast color
    };
  }
  // Jika hanya actual data
  else if (actualCount > 0) {
    return {
      startFillColor: 'rgba(221, 87, 70, 0.4)',
      endFillColor: 'rgba(221, 87, 70, 0.05)'
    };
  }
  // Jika hanya forecast data
  else {
    return {
      startFillColor: 'rgba(3, 174, 210, 0.4)',
      endFillColor: 'rgba(3, 174, 210, 0.05)'
    };
  }
};

// Calculate dynamic spacing for chart based on data length
export const calculateDynamicSpacing = (dataLength, minSpacing = 40, maxSpacing = 80) => {
  const screenWidth = getScreenDimension().width;
  const availableWidth = screenWidth - 120; // Account for margins and y-axis labels
  
  if (dataLength === 0) return minSpacing;
  
  const calculatedSpacing = availableWidth / dataLength;
  
  // Ensure spacing is within reasonable bounds
  return Math.max(minSpacing, Math.min(maxSpacing, calculatedSpacing));
};

// Calculate chart width based on data points and spacing
export const calculateChartWidth = (dataLength, spacing = 60) => {
  const screenWidth = getScreenDimension().width;
  const calculatedWidth = dataLength * spacing + 100; // Add padding for y-axis
  
  // Return at least screen width, or calculated width if larger (for scrollable chart)
  return Math.max(screenWidth - 40, calculatedWidth);
};

// Get dynamic max value for Y-axis based on data
export const calculateMaxValue = (data) => {
  if (!data || data.length === 0) return 5;
  
  const maxValue = Math.max(...data.map(item => item.value || 0));
  
  // Add 20% padding to max value for better visualization
  return Math.ceil(maxValue * 1.2);
};

// Generate chart colors based on data type (actual vs forecast)
export const getDataPointColors = (data) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(item => 
    item.isForecast ? '#006DFF' : 'rgb(221, 87, 70)'
  );
};

// Chart configuration presets
export const chartPresets = {
  responsive: {
    curved: false,
    thickness: 3,
    dataPointsRadius: 5,
    dataPointsWidth: 2,
    hideDataPoints: false,
    focusEnabled: true,
    showDataPointLabelOnFocus: true,
    showStripOnFocus: true,
    isAnimated: true,
    animationDuration: 1500,
    animateOnDataChange: true,
    rulesType: "solid",
    rulesColor: "rgba(0,0,0,0.05)",
    showVerticalLines: true,
    verticalLinesColor: "rgba(0,0,0,0.05)",
    xAxisThickness: 2,
    yAxisThickness: 2,
    xAxisColor: 'rgba(0,0,0,0.1)',
    yAxisColor: 'rgba(0,0,0,0.1)',
  },
  colors: {
    actual: '#DD5746', // COLOR_MAIN_SECONDARY untuk actual data
    forecast: '#03AED2', // COLOR_PRIMARY untuk forecast data
    actualArea: 'rgba(221, 87, 70, 0.3)', // Gradient actual dengan transparansi
    forecastArea: 'rgba(3, 174, 210, 0.3)', // Gradient forecast dengan transparansi
    strip: 'rgba(3, 174, 210, 0.1)',
    grid: 'rgba(0,0,0,0.05)',
  }
};

// Format hour display
export const formatHourDisplay = (hour) => {
  if (hour === 0) return '12:00 AM';
  if (hour === 12) return '12:00 PM';
  if (hour < 12) return `${hour}:00 AM`;
  return `${hour - 12}:00 PM`;
};

// Create custom pointer config for better UX with chart type detection
export const createPointerConfig = (colors, chartType = 'daily') => ({
  pointer1Color: colors.actual,
  pointer2Color: colors.forecast,
  radius: 6,
  pointerLabelWidth: 120,
  pointerLabelHeight: chartType === 'monthly' ? 90 : 120, // Lebih kecil untuk monthly
  activatePointersOnLongPress: false,
  autoAdjustPointerLabelPosition: true,
  pointerLabelComponent: (items) => {
    const item = items[0];
    const isActual = !item.isForecast;
    
    // Deteksi tipe chart berdasarkan data structure
    let detectedChartType = chartType;
    if (item.label && item.label.includes('\n') && item.label.includes(':')) {
      detectedChartType = 'period'; // Period chart memiliki format "DD MMM\nHH:MM"
    } else if (item.label && !item.label.includes(':') && !item.hour && !item.time) {
      detectedChartType = 'monthly'; // Monthly chart hanya nama bulan
    }
    
    // Format waktu berdasarkan tipe chart
    let timeDisplay = '';
    let dateDisplay = '';
    
    if (detectedChartType === 'period') {
      // Untuk Period chart: extract dari label yang format "DD MMM\nHH:MM"
      const labelParts = item.label ? item.label.split('\n') : [];
      if (labelParts.length >= 2) {
        dateDisplay = labelParts[0]; // "27 Aug"
        timeDisplay = labelParts[1]; // "00:00"
      } else if (item.time) {
        timeDisplay = item.time;
      }
    } else if (detectedChartType === 'monthly') {
      // Untuk Monthly chart: tidak perlu jam, hanya label bulan
      dateDisplay = item.label || '';
      timeDisplay = ''; // Kosong untuk monthly
    } else {
      // Untuk Daily/Hourly chart
      if (item.time) {
        timeDisplay = item.time;
      } else if (item.hour !== null && item.hour !== undefined) {
        timeDisplay = formatHourDisplay(item.hour);
      }
      
      if (item.date) {
        dateDisplay = item.date;
      }
    }
    
    return (
      <View style={{
        height: detectedChartType === 'monthly' ? 90 : 120,
        width: 120,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: isActual ? colors.actual : colors.forecast,
        paddingHorizontal: 15,
        paddingVertical: 12,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
      }}>
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
        
        <Text style={{
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 16,
          color: isActual ? colors.actual : colors.forecast,
          marginBottom: 4
        }}>
          {item.value.toFixed(2)} m
        </Text>
        
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
