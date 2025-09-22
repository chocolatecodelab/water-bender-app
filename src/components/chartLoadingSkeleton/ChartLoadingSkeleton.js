/**
 * ChartLoadingSkeleton Component
 * 
 * A reusable loading skeleton component for chart sections in the water monitoring dashboard.
 * Displays animated loading indicators, skeleton placeholders, and context-aware loading states
 * while chart data is being fetched from the API.
 * 
 * Features:
 * - Animated loading indicators with chart-specific icons
 * - Contextual loading messages and progress indicators
 * - Responsive design with skeleton animations
 * - Chart type-specific styling and branding
 * - Professional loading UI with information panels
 * 
 * @component
 * @example
 * // Basic usage
 * <ChartLoadingSkeleton 
 *   chartType="Period" 
 *   title="Water Surface By Period" 
 * />
 * 
 * // With subtitle
 * <ChartLoadingSkeleton 
 *   chartType="Monthly" 
 *   title="Monthly Trends" 
 *   subtitle="Long-term analysis"
 * />
 * 
 * // Different chart types
 * <ChartLoadingSkeleton 
 *   chartType="Daily" 
 *   title="Hourly Monitoring"
 *   customStyle={{ marginTop: 10 }}
 * />
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

// ===== UTILITY IMPORTS =====
import { 
  COLOR_PRIMARY,
  COLOR_MAIN_SECONDARY,
  COLOR_GRAY_2,
  COLOR_WHITE 
} from '../../tools/constant';

/**
 * Component Props Interface
 * @typedef {Object} ChartLoadingSkeletonProps
 * @property {string} chartType - Type of chart being loaded (Period, Monthly, Daily, Hourly)
 * @property {string} title - Loading title text to display
 * @property {string} [subtitle] - Optional subtitle text
 * @property {Object} [customStyle] - Additional styling for the container
 * @property {string} [testID] - Test identifier for testing purposes
 */

// ===== CONSTANTS =====
const CHART_ICONS = {
  Period: 'chart-timeline',
  Monthly: 'chart-bar',
  Daily: 'chart-line',
  Hourly: 'chart-line',
  default: 'chart-line'
};

const LOADING_SKELETON_WIDTHS = [40, 60, 30];

// ===== HELPER FUNCTIONS =====
const getScreenDimension = () => Dimensions.get('window');

const getChartIcon = (chartType) => {
  return CHART_ICONS[chartType] || CHART_ICONS.default;
};

// ===== COMPONENT STYLES =====
const styles = StyleSheet.create({
  // Container styles
  container: {
    backgroundColor: COLOR_WHITE,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.3)',
  },
  
  // Header styles
  loadingHeader: {
    width: "100%",
    marginTop: 10,
    marginBottom: 20,
  },
  headerContent: {
    backgroundColor: 'rgba(221, 87, 70, 0.1)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLOR_MAIN_SECONDARY,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(221, 87, 70, 0.7)',
    marginTop: 4,
    textAlign: 'center',
  },
  
  // Info panel styles
  infoPanel: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderRadius: 12,
    paddingVertical: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  loadingSkeleton: {
    backgroundColor: 'rgba(203, 213, 225, 0.6)',
    borderRadius: 4,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    backgroundColor: 'orange',
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    color: 'orange',
    fontWeight: '600',
  },
  
  // Chart area styles
  chartArea: {
    backgroundColor: 'rgba(248, 250, 252, 0.6)',
    borderRadius: 12,
    marginHorizontal: 5,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.4)',
  },
  iconContainer: {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    borderRadius: 50,
    padding: 20,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR_GRAY_2,
    textAlign: 'center',
    marginBottom: 8,
  },
  subLoadingText: {
    fontSize: 12,
    color: 'rgba(107, 114, 128, 0.8)',
    textAlign: 'center',
    lineHeight: 18,
  },
  skeletonContainer: {
    width: '80%',
    marginTop: 20,
    gap: 8,
  },
  
  // Footer styles
  footer: {
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'rgba(25, 118, 210, 0.04)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLOR_PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(25, 118, 210, 0.8)',
    fontStyle: 'italic',
    flex: 1,
  },
});

// ===== COMPONENT RENDERERS =====
const renderSkeletonBars = () => {
  return LOADING_SKELETON_WIDTHS.map((width, index) => (
    <View 
      key={index} 
      style={[
        styles.loadingSkeleton,
        { height: 4, width: `${width}%`, borderRadius: 2 }
      ]} 
    />
  ));
};

const renderInfoRow = (iconName, skeletonWidth) => (
  <View style={styles.infoRow}>
    <MaterialCommunityIcons 
      name={iconName}
      size={16} 
      color={COLOR_PRIMARY} 
      style={{ marginRight: 8 }}
    />
    <View style={[
      styles.loadingSkeleton,
      { height: 12, width: skeletonWidth, borderRadius: 6 }
    ]} />
  </View>
);

// ===== MAIN COMPONENT =====
const ChartLoadingSkeleton = ({
  chartType = 'Period',
  title = 'Loading Chart Data',
  subtitle = null,
  customStyle = {},
  testID = 'chart-loading-skeleton',
  ...otherProps
}) => {
  // Validation
  if (!chartType || !title) {
    console.warn('ChartLoadingSkeleton: chartType and title are required props');
    return null;
  }

  const screenHeight = getScreenDimension().height;
  const chartIcon = getChartIcon(chartType);

  return (
    <View 
      style={[styles.container, { marginTop: 20 }, customStyle]} 
      testID={testID}
      {...otherProps}
    >
      {/* Loading Header */}
      <View style={styles.loadingHeader}>
        <View style={styles.headerContent}>
          <View style={styles.headerRow}>
            <ActivityIndicator 
              size="small" 
              color={COLOR_MAIN_SECONDARY} 
              style={{ marginRight: 8 }} 
            />
            <Text style={styles.title}>
              {title}
            </Text>
          </View>
          {subtitle && (
            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      
      {/* Loading Info Panel */}
      <View style={styles.infoPanel}>
        <View style={styles.infoContent}>
          {renderInfoRow('database-sync', 120)}
          <View style={[styles.infoRow, { marginBottom: 0 }]}>
            {renderInfoRow('clock-outline', 80)}
          </View>
        </View>
        
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            LOADING
          </Text>
        </View>
      </View>

      {/* Loading Chart Area */}
      <View style={[
        styles.chartArea,
        { minHeight: screenHeight / 2.5 }
      ]}>
        {/* Animated Loading Icon */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name={chartIcon}
            size={40} 
            color={COLOR_PRIMARY}
            style={{ opacity: 0.6 }}
          />
        </View>
        
        {/* Loading Indicators */}
        <ActivityIndicator 
          size="large" 
          color={COLOR_PRIMARY} 
          style={{ marginBottom: 16 }} 
        />
        <Text style={styles.loadingText}>
          Loading {chartType} Data
        </Text>
        <Text style={styles.subLoadingText}>
          Fetching water monitoring data...{'\n'}This may take a few moments
        </Text>
        
        {/* Loading Progress Skeleton */}
        <View style={styles.skeletonContainer}>
          {renderSkeletonBars()}
        </View>
      </View>
      
      {/* Loading Footer */}
      <View style={styles.footer}>
        <MaterialCommunityIcons 
          name="information-outline" 
          size={16} 
          color={COLOR_PRIMARY}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.footerText}>
          Chart will display automatically once data is loaded • Please wait
        </Text>
      </View>
    </View>
  );
};

// ===== PROP TYPES =====
ChartLoadingSkeleton.propTypes = {
  chartType: PropTypes.oneOf(['Period', 'Monthly', 'Daily', 'Hourly']).isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  customStyle: PropTypes.object,
  testID: PropTypes.string,
};

// ===== DEFAULT PROPS =====
ChartLoadingSkeleton.defaultProps = {
  chartType: 'Period',
  title: 'Loading Chart Data',
  subtitle: null,
  customStyle: {},
  testID: 'chart-loading-skeleton',
};

export default ChartLoadingSkeleton;