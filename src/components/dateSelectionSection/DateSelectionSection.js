/**
 * DateSelectionSection Component
 * 
 * Modern date range selection component for dashboard with quick filter options,
 * responsive design, and real-time refresh status indicators. Features intuitive
 * date picker interface with predefined quick select buttons for common date ranges.
 * 
 * Features:
 * - Modern card-based date selection interface
 * - Quick filter buttons (Today, Yesterday, Last Week)
 * - Responsive design with landscape mode optimization
 * - Real-time refresh status indicator
 * - Professional styling with gradients and shadows
 * - Accessibility support with proper touch targets
 * 
 * @component
 * @example
 * // Basic usage
 * <DateSelectionSection 
 *   selectedDate={new Date()}
 *   onDateSelect={handleDateSelect}
 *   onDateRangeSelect={handleDateRangeSelect}
 * />
 * 
 * // With refresh status
 * <DateSelectionSection 
 *   selectedDate={startDate}
 *   isRefreshing={true}
 *   isLandscape={false}
 *   onDatePickerPress={openDatePicker}
 *   onQuickFilterSelect={handleQuickFilter}
 * />
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import PropTypes from 'prop-types';

// ===== UTILITY IMPORTS =====
import { 
  COLOR_PRIMARY,
  COLOR_WHITE
} from '../../tools/constant';

/**
 * Component Props Interface
 * @typedef {Object} DateSelectionSectionProps
 * @property {Date} selectedDate - Currently selected start date
 * @property {boolean} [isRefreshing] - Whether data is currently being refreshed
 * @property {boolean} [isLandscape] - Whether device is in landscape orientation
 * @property {Function} onDatePickerPress - Callback when date picker is pressed
 * @property {Function} onQuickFilterSelect - Callback when quick filter is selected (startDate, finishDate)
 * @property {Object} [containerStyle] - Additional styling for the container
 * @property {string} [testID] - Test identifier for testing purposes
 */

// ===== CONSTANTS =====
const QUICK_FILTERS = [
  { label: 'Today', days: 0 },
  { label: 'Yesterday', days: -1 },
  { label: 'Last Week', days: -7 }
];

const DATE_RANGE_DAYS = 3; // Default 3-day range

// ===== HELPER FUNCTIONS =====
const formatSelectedDate = (date) => {
  return moment(date).format('DD MMMM YYYY');
};

const calculateDateRange = (startDays) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + startDays);
  
  const finishDate = new Date(startDate);
  finishDate.setDate(finishDate.getDate() + DATE_RANGE_DAYS);
  
  return { startDate, finishDate };
};

// ===== COMPONENT STYLES =====
const styles = StyleSheet.create({
  // Container styles
  modernDateSection: {
    marginBottom: 10,
  },
  
  // Section header styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR_WHITE,
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  refreshStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  refreshText: {
    fontSize: 12,
    color: COLOR_WHITE,
    fontWeight: '600',
  },
  
  // Date card styles
  dateCard: {
    backgroundColor: COLOR_WHITE,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  
  // Date selector styles
  dateSelector: {
    marginBottom: 20,
  },
  dateSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 118, 210, 0.06)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(25, 118, 210, 0.1)',
  },
  dateIconContainer: {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: 'rgba(107, 114, 128, 0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  dateRangeTag: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  dateRangeText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  chevronContainer: {
    padding: 8,
  },
  
  // Quick filters styles
  quickFilters: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.6)',
    paddingTop: 16,
  },
  quickFiltersTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickFiltersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickFilterButton: {
    flex: 1,
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(25, 118, 210, 0.15)',
  },
  quickFilterText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLOR_PRIMARY,
  },
});

// ===== COMPONENT RENDERERS =====
const renderSectionHeader = ({ isRefreshing }) => (
  <View style={styles.sectionHeader}>
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
      <MaterialCommunityIcons 
        name="calendar-range" 
        size={22} 
        color={COLOR_WHITE} 
      />
      <Text style={styles.sectionTitle}>Date Range Selection</Text>
    </View>
    
    {/* Refresh Status Indicator */}
    {isRefreshing && (
      <View style={styles.refreshStatus}>
        <ActivityIndicator 
          size="small" 
          color={COLOR_WHITE} 
          style={{ marginRight: 6 }} 
        />
        <Text style={styles.refreshText}>
          Refreshing...
        </Text>
      </View>
    )}
  </View>
);

const renderDateSelector = ({ selectedDate, onDatePickerPress }) => (
  <TouchableOpacity 
    style={styles.dateSelector}
    onPress={onDatePickerPress}
    activeOpacity={0.8}
  >
    <View style={styles.dateSelectorContent}>
      <View style={styles.dateIconContainer}>
        <MaterialCommunityIcons 
          name="calendar-check-outline" 
          size={24} 
          color={COLOR_PRIMARY} 
        />
      </View>
      
      <View style={styles.dateTextContainer}>
        <Text style={styles.dateLabel}>Selected Date Range</Text>
        <Text style={styles.dateValue}>
          {formatSelectedDate(selectedDate)}
        </Text>
        <View style={styles.dateRangeTag}>
          <Text style={styles.dateRangeText}>{DATE_RANGE_DAYS}-day range</Text>
        </View>
      </View>
      
      <View style={styles.chevronContainer}>
        <MaterialCommunityIcons 
          name="chevron-right" 
          size={20} 
          color={COLOR_PRIMARY} 
          style={{ opacity: 0.6 }}
        />
      </View>
    </View>
  </TouchableOpacity>
);

const renderQuickFilters = ({ onQuickFilterSelect }) => (
  <View style={styles.quickFilters}>
    <Text style={styles.quickFiltersTitle}>Quick Select:</Text>
    <View style={styles.quickFiltersRow}>
      {QUICK_FILTERS.map((filter, index) => (
        <TouchableOpacity
          key={index}
          style={styles.quickFilterButton}
          onPress={() => {
            const { startDate, finishDate } = calculateDateRange(filter.days);
            onQuickFilterSelect(startDate, finishDate);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.quickFilterText}>{filter.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// ===== MAIN COMPONENT =====
const DateSelectionSection = ({
  selectedDate = new Date(),
  isRefreshing = false,
  isLandscape = false,
  onDatePickerPress = () => {},
  onQuickFilterSelect = () => {},
  containerStyle = {},
  testID = 'date-selection-section',
  ...otherProps
}) => {
  // Validation
  if (!selectedDate) {
    console.warn('DateSelectionSection: selectedDate is required');
    return null;
  }

  return (
    <View 
      style={[styles.modernDateSection, containerStyle]} 
      testID={testID}
      {...otherProps}
    >
      {/* Section Header */}
      {renderSectionHeader({ isRefreshing })}

      {/* Modern Date Selector Card - Hidden in Landscape for Better Space Usage */}
      {!isLandscape && (
        <View style={styles.dateCard}>
          {/* Date Selector */}
          {renderDateSelector({ selectedDate, onDatePickerPress })}

          {/* Quick Date Filters */}
          {renderQuickFilters({ onQuickFilterSelect })}
        </View>
      )}
    </View>
  );
};

// ===== PROP TYPES =====
DateSelectionSection.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  isRefreshing: PropTypes.bool,
  isLandscape: PropTypes.bool,
  onDatePickerPress: PropTypes.func.isRequired,
  onQuickFilterSelect: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
  testID: PropTypes.string,
};

// ===== DEFAULT PROPS =====
DateSelectionSection.defaultProps = {
  selectedDate: new Date(),
  isRefreshing: false,
  isLandscape: false,
  onDatePickerPress: () => {},
  onQuickFilterSelect: () => {},
  containerStyle: {},
  testID: 'date-selection-section',
};

export default DateSelectionSection;