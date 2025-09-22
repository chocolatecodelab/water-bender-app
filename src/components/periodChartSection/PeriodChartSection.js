/**
 * PeriodChartSection Component
 * 
 * Displays period-based water surface data in an interactive line chart with
 * area fill, responsive design, and comprehensive data visualization features.
 * Includes chart metadata, responsive scrolling, and professional styling.
 * 
 * Features:
 * - Interactive LineChart with area fill and curved lines
 * - Responsive horizontal scrolling for large datasets
 * - Chart metadata display (data points count, date range)
 * - Professional badge indicators and info panels
 * - Pointer configuration for detailed value tooltips
 * - Shadow and elevation effects for modern appearance
 * 
 * @component
 * @example
 * // Basic usage
 * <PeriodChartSection 
 *   chartData={periodData}
 *   startDate={new Date()}
 *   finishDate={new Date()}
 *   isLoading={false}
 * />
 * 
 * // With loading state
 * <PeriodChartSection 
 *   chartData={[]}
 *   startDate={startDate}
 *   finishDate={finishDate}
 *   isLoading={true}
 * />
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from "react-native-gifted-charts";
import moment from 'moment';
import PropTypes from 'prop-types';

// ===== COMPONENT IMPORTS =====
import { ChartLoadingSkeleton } from '../';

// ===== UTILITY IMPORTS =====
import { 
  COLOR_MAIN_SECONDARY,
  COLOR_WHITE,
  COLOR_GRAY_2
} from '../../tools/constant';
import { getScreenDimension } from '../../tools/helper';
import { createPointerConfig, chartPresets, calculateMaxValue } from '../../tools/chartUtils';

/**
 * Component Props Interface
 * @typedef {Object} PeriodChartSectionProps
 * @property {Array} chartData - Period chart data array
 * @property {Date} startDate - Start date for period range
 * @property {Date} finishDate - Finish date for period range
 * @property {boolean} [isLoading] - Loading state for chart
 * @property {Object} [containerStyle] - Additional styling for container
 * @property {string} [testID] - Test identifier for testing purposes
 */

// ===== CONSTANTS =====
const CHART_PRESETS = {
  colors: {
    primary: "rgb(221, 87, 70)",
    primaryRgba: "rgba(221, 87, 70, 0.8)",
    secondary: "rgb(255, 122, 104)",
    secondaryRgba: "rgba(255, 122, 104, 0.1)",
    accent: "rgba(221, 87, 70, 0.3)",
    background: "rgba(221, 87, 70, 0.05)",
    border: "rgba(221, 87, 70, 0.2)"
  }
};

// ===== HELPER FUNCTIONS =====
const calculateChartSpacing = (dataLength) => {
  const screenWidth = getScreenDimension().width;
  return Math.max(70, Math.min(90, screenWidth / Math.max(dataLength, 1)));
};

const calculateChartWidth = (dataLength) => {
  const screenWidth = getScreenDimension().width;
  return Math.max(
    screenWidth - 80,
    dataLength * 90 + 100
  );
};

// ===== COMPONENT STYLES =====
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_WHITE,
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
  dateRangeText: {
    fontSize: 11,
    color: COLOR_GRAY_2,
    marginTop: 2,
  },
  badgeContainer: {
    backgroundColor: CHART_PRESETS.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: CHART_PRESETS.colors.border,
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
    fontSize: 8,
    fontWeight: '400',
    width: 60,
    flexWrap: 'wrap'
  },
  infoContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: CHART_PRESETS.colors.background,
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

/**
 * PeriodChartSection - A reusable component that displays period water surface chart
 * 
 * @description This component renders a period water surface chart with area fill,
 * interactive pointer configuration, and responsive design that adapts to different screen sizes.
 * 
 * @features
 * - Area chart with gradient fill and curved lines
 * - Horizontal scrolling for better data visualization
 * - Interactive tooltips and pointer configuration
 * - Responsive design with dynamic spacing
 * - Loading state with skeleton component
 * - Chart metadata display with data points count
 * - Shadow effects and modern styling
 * 
 * @param {Object} props - Component props
 * @param {Array} props.chartData - Period chart data points array
 * @param {Date} props.startDate - Start date for period range
 * @param {Date} props.finishDate - Finish date for period range
 * @param {boolean} props.isLoading - Loading state indicator
 * @param {Object} props.style - Additional styles for the container
 * 
 * @example
 * <PeriodChartSection 
 *   chartData={generateChartWaterBenderPeriod}
 *   startDate={startDate}
 *   finishDate={finishDate}
 *   isLoading={false}
 *   style={{ marginTop: 20 }}
 * />
 * 
 * @author Water Monitoring Dashboard Team
 * @version 1.0.0
 */
const PeriodChartSection = ({
  chartData = [],
  startDate = new Date(),
  finishDate = new Date(),
  isLoading = false,
  style = {}
}) => {
  // Show loading skeleton if data is loading or empty
  if (isLoading || !chartData || chartData.length === 0) {
    return (
      <ChartLoadingSkeleton 
        chartType="Period"
        title="Loading Water Surface By Period"
        subtitle="Processing period-based water surface data"
      />
    );
  }

  const screenDimension = getScreenDimension();
  const dataLength = chartData.length;
  
  // Calculate responsive spacing based on screen width and data points
  const spacing = calculateChartSpacing(dataLength);
  
  // Calculate responsive chart width
  const chartWidth = calculateChartWidth(dataLength);

  return (
    <View style={[styles.container, style]}>
      {/* Chart Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          Water Surface By Period
        </Text>
      </View>
      
      {/* Chart Metadata */}
      <View style={styles.metadataContainer}>
        <View style={styles.metadataLeft}>
          <Text style={styles.dataPointsText}>
            📊 Period Data Points: {dataLength}
          </Text>
          <Text style={styles.dateRangeText}>
            Date Range: {moment(startDate).format('DD MMM')} - {moment(finishDate).format('DD MMM')}
          </Text>
        </View>
        
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>
            PERIOD
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
          data={chartData}
          yAxisLabelWidth={60}
          maxValue={calculateMaxValue(chartData)}
          xAxisThickness={1}
          yAxisThickness={1}
          yAxisTextStyle={styles.yAxisTextStyle}
          xAxisLabelTextStyle={styles.xAxisLabelTextStyle}
          width={chartWidth}
          height={screenDimension.height / 2.1}
          startFillColor={CHART_PRESETS.colors.primary}
          startOpacity={0.8}
          endFillColor={CHART_PRESETS.colors.secondary}
          endOpacity={0.1}
          color={CHART_PRESETS.colors.primary}
          stripColor={CHART_PRESETS.colors.accent}
          stripOpacity={0.3}
          stripWidth={2}
          isAnimated
          animationDuration={1200}
          pointerConfig={createPointerConfig(chartPresets.colors, 'period')}
          initialSpacing={10}
          endSpacing={20}
        />
      </ScrollView>
      
      {/* Additional Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          📊 Swipe/Tap on chart for detailed values • Period-based water surface data
        </Text>
      </View>
    </View>
  );
};

PeriodChartSection.propTypes = {
  /** Array of period chart data points */
  chartData: PropTypes.arrayOf(PropTypes.object),
  /** Start date for period range */
  startDate: PropTypes.instanceOf(Date),
  /** Finish date for period range */
  finishDate: PropTypes.instanceOf(Date),
  /** Loading state indicator */
  isLoading: PropTypes.bool,
  /** Additional styles for the container */
  style: PropTypes.object,
};

PeriodChartSection.defaultProps = {
  chartData: [],
  startDate: new Date(),
  finishDate: new Date(),
  isLoading: false,
  style: {},
};

export default PeriodChartSection;