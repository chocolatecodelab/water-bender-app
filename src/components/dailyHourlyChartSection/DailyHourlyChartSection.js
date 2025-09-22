import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import PropTypes from 'prop-types';
import { 
  COLOR_MAIN_SECONDARY, 
  COLOR_WHITE, 
  COLOR_GRAY_2,
  COLOR_PRIMARY
} from '../../tools/constant';
import { getScreenDimension } from '../../tools/helper';
import { createPointerConfig, chartPresets, calculateMaxValue } from '../../tools/chartUtils';
import ChartLoadingSkeleton from '../chartLoadingSkeleton';

/**
 * DailyHourlyChartSection - A reusable component that displays daily/hourly water surface chart with forecast support
 * 
 * @description This component renders an hourly water surface chart with forecast data,
 * supporting both actual and predicted values with different visual indicators.
 * Features area chart with gradient fill, interactive tooltips, and real-time forecast loading states.
 * 
 * @features
 * - Area chart with gradient fill and curved lines
 * - Forecast data support with visual differentiation
 * - Horizontal scrolling for better data visualization
 * - Interactive tooltips with hourly precision
 * - Real-time forecast loading indicator
 * - Responsive design with dynamic spacing
 * - Multi-color support for actual vs forecast data
 * - Enhanced styling for hourly time labels
 * - Loading state with skeleton component
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Daily/hourly chart data points array with forecast support
 * @param {boolean} props.loading - Loading state indicator
 * @param {boolean} props.isForecastLoading - Forecast loading state indicator
 * @param {Function} props.getDataPointLineColors - Function to get line colors based on data type
 * @param {Object} props.style - Additional styles for the container
 * 
 * @example
 * <DailyHourlyChartSection 
 *   data={generateChartWaterBenderDailyWithForecast}
 *   loading={false}
 *   isForecastLoading={false}
 *   getDataPointLineColors={getDataPointLineColors}
 *   style={{ marginTop: 20 }}
 * />
 * 
 * @author Water Monitoring Dashboard Team
 * @version 1.0.0
 */
const DailyHourlyChartSection = ({ 
  data = [], 
  loading = false,
  isForecastLoading = false,
  getDataPointLineColors,
  style = {} 
}) => {
  // Show loading skeleton if data is loading or empty
  if (loading || !data || data.length === 0) {
    return (
      <ChartLoadingSkeleton 
        chartType="Hourly"
        title="Loading Water Surface By Hourly (with Forecast)"
        subtitle="Processing real-time data and forecast predictions"
      />
    );
  }

  const screenDimension = getScreenDimension();
  const dataLength = data.length;
  
  // Calculate responsive spacing for hourly data
  const spacing = Math.max(60, Math.min(80, screenDimension.width / Math.max(dataLength, 1)));
  
  // Calculate responsive chart width for hourly data
  const chartWidth = Math.max(
    screenDimension.width - 80,
    dataLength * 70 + 100
  );

  // Separate actual and forecast data for metadata
  const actualData = data.filter(d => d.isActual);
  const forecastData = data.filter(d => d.isForecast);

  return (
    <View style={[styles.container, style]}>
      {/* Chart Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          Water Surface By Hourly (with Forecast)
        </Text>
      </View>
      
      {/* Chart Metadata */}
      <View style={styles.metadataContainer}>
        <View style={styles.metadataLeft}>
          <Text style={styles.dataPointsText}>
            📊 Hourly Data Points: {dataLength}
          </Text>
          <Text style={styles.forecastText}>
            Actual: {actualData.length} | Forecast: {forecastData.length}
            {isForecastLoading && <Text style={styles.loadingIndicator}> ⟳</Text>}
          </Text>
        </View>
        
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>
            HOURLY
          </Text>
        </View>
      </View>

      {/* Chart Container with Horizontal Scroll */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        style={styles.chartScrollView}
        contentContainerStyle={[
          styles.chartContentContainer,
          { minWidth: screenDimension.width - 10 }
        ]}
      >
        <LineChart
          areaChart
          curved
          noOfSections={6}
          spacing={spacing}
          data={data}
          yAxisLabelWidth={60}
          maxValue={calculateMaxValue(data)}
          width={chartWidth}
          height={screenDimension.height / 1.8}
          xAxisThickness={1}
          yAxisThickness={1}
          yAxisTextStyle={styles.yAxisTextStyle}
          xAxisLabelTextStyle={styles.xAxisLabelTextStyle}
          hideDataPoints={false}
          dataPointHeight={6}
          dataPointWidth={6}
          dataPointRadius={3}
          startFillColor="rgb(221, 87, 70)"
          startOpacity={0.8}
          endFillColor="rgb(255, 122, 104)"
          endOpacity={0.1}
          color="rgb(221, 87, 70)"
          getColor={getDataPointLineColors}
          stripColor="rgba(221, 87, 70, 0.3)"
          stripOpacity={0.3}
          stripWidth={2}
          isAnimated
          animationDuration={1200}
          pointerConfig={createPointerConfig(chartPresets.colors, 'daily')}
          initialSpacing={10}
          endSpacing={20}
        />
      </ScrollView>
      
      {/* Additional Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          📊 Swipe/Tap on chart for detailed values • Red: Real-time data • Blue: 12-hour forecast
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleContainer: {
    width: "100%",
    marginTop: 10,
  },
  titleText: {
    bottom: 24,
    padding: 7,
    textAlign: "center",
    borderRadius: 3,
    fontWeight: "bold",
    fontSize: 15,
    backgroundColor: COLOR_MAIN_SECONDARY,
    color: COLOR_WHITE,
  },
  metadataContainer: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  metadataLeft: {
    flex: 1,
  },
  dataPointsText: {
    fontSize: 12,
    color: COLOR_GRAY_2,
    fontWeight: '500',
  },
  forecastText: {
    fontSize: 11,
    color: COLOR_GRAY_2,
    marginTop: 2,
  },
  loadingIndicator: {
    color: COLOR_PRIMARY,
  },
  badgeContainer: {
    backgroundColor: 'rgba(221, 87, 70, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(221, 87, 70, 0.2)',
  },
  badgeText: {
    fontSize: 10,
    color: COLOR_MAIN_SECONDARY,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chartScrollView: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartContentContainer: {
    padding: 15,
  },
  yAxisTextStyle: {
    color: COLOR_GRAY_2,
    fontSize: 12,
    fontWeight: '500',
  },
  xAxisLabelTextStyle: {
    color: COLOR_GRAY_2,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 12,
    includeFontPadding: false,
    textAlignVertical: 'top',
    marginTop: -2,
    paddingTop: 0,
  },
  infoContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(221, 87, 70, 0.05)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLOR_MAIN_SECONDARY,
  },
  infoText: {
    fontSize: 12,
    color: COLOR_GRAY_2,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

DailyHourlyChartSection.propTypes = {
  /** Array of daily/hourly chart data points with forecast support */
  data: PropTypes.arrayOf(PropTypes.object),
  /** Loading state indicator */
  loading: PropTypes.bool,
  /** Forecast loading state indicator */
  isForecastLoading: PropTypes.bool,
  /** Function to get line colors based on data type (actual vs forecast) */
  getDataPointLineColors: PropTypes.func,
  /** Additional styles for the container */
  style: PropTypes.object,
};

DailyHourlyChartSection.defaultProps = {
  data: [],
  loading: false,
  isForecastLoading: false,
  getDataPointLineColors: () => 'rgb(221, 87, 70)',
  style: {},
};

export default DailyHourlyChartSection;