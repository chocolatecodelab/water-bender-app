import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import PropTypes from 'prop-types';
import moment from 'moment';
import { 
  COLOR_MAIN_SECONDARY, 
  COLOR_WHITE, 
  COLOR_GRAY_2 
} from '../../tools/constant';
import { getScreenDimension } from '../../tools/helper';
import { createPointerConfig, chartPresets, calculateMaxValue } from '../../tools/chartUtils';
import { ChartLoadingSkeleton } from '../';

/**
 * MonthlyChartSection - A reusable component that displays monthly water surface chart
 * 
 * @description This component renders a monthly water surface chart with area fill,
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
 * @param {Array} props.data - Monthly chart data points array
 * @param {boolean} props.loading - Loading state indicator
 * @param {Object} props.style - Additional styles for the container
 * 
 * @example
 * <MonthlyChartSection 
 *   data={generateChartWaterBenderMonthly}
 *   loading={false}
 *   style={{ marginTop: 20 }}
 * />
 * 
 * @author Water Monitoring Dashboard Team
 * @version 1.0.0
 */
const MonthlyChartSection = ({ 
  data = [], 
  loading = false, 
  style = {} 
}) => {
  // Show loading skeleton if data is loading or empty
  if (loading || !data || data.length === 0) {
    return (
      <ChartLoadingSkeleton 
        chartType="Monthly"
        title="Loading Water Surface By Monthly"
        subtitle="Processing monthly water surface trends"
      />
    );
  }

  const screenDimension = getScreenDimension();
  const dataLength = data.length;
  
  // Calculate responsive spacing based on screen width and data points
  const spacing = Math.max(70, Math.min(90, screenDimension.width / Math.max(dataLength, 1)));
  
  // Calculate responsive chart width
  const chartWidth = Math.max(
    screenDimension.width - 80,
    dataLength * 90 + 100
  );

  return (
    <View style={[styles.container, style]}>
      {/* Chart Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          Water Surface By Monthly
        </Text>
      </View>
      
      {/* Chart Metadata */}
      <View style={styles.metadataContainer}>
        <View style={styles.metadataLeft}>
          <Text style={styles.dataPointsText}>
            📊 Monthly Data Points: {dataLength}
          </Text>
          <Text style={styles.yearText}>
            Year Overview: {moment().format('YYYY')}
          </Text>
        </View>
        
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>
            MONTHLY
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
          xAxisThickness={1}
          yAxisThickness={1}
          yAxisTextStyle={styles.yAxisTextStyle}
          xAxisLabelTextStyle={styles.xAxisLabelTextStyle}
          width={chartWidth}
          height={screenDimension.height / 2.1}
          startFillColor="rgb(221, 87, 70)"
          startOpacity={0.8}
          endFillColor="rgb(255, 122, 104)"
          endOpacity={0.1}
          color="rgb(221, 87, 70)"
          stripColor="rgba(221, 87, 70, 0.3)"
          stripOpacity={0.3}
          stripWidth={2}
          isAnimated
          animationDuration={1200}
          pointerConfig={createPointerConfig(chartPresets.colors, 'monthly')}
          initialSpacing={10}
          endSpacing={20}
        />
      </ScrollView>
      
      {/* Additional Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          📊 Swipe/Tap on chart for detailed values • Monthly water surface trends
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
  yearText: {
    fontSize: 11,
    color: COLOR_GRAY_2,
    marginTop: 2,
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
    fontSize: 11,
    fontWeight: '400',
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

MonthlyChartSection.propTypes = {
  /** Array of monthly chart data points */
  data: PropTypes.arrayOf(PropTypes.object),
  /** Loading state indicator */
  loading: PropTypes.bool,
  /** Additional styles for the container */
  style: PropTypes.object,
};

MonthlyChartSection.defaultProps = {
  data: [],
  loading: false,
  style: {},
};

export default MonthlyChartSection;