/**
 * WaterDepthCards Component
 * 
 * Displays water monitoring data in modern card layouts showing current depth
 * and daily average values. Features gradient cards with live status indicators,
 * trend information, and responsive design for optimal data visualization.
 * 
 * Features:
 * - Current water depth with live data indicator
 * - Daily average depth with trend analysis
 * - Modern gradient card design with shadows
 * - Responsive layout with proper spacing
 * - Real-time status indicators and icons
 * - Professional typography and color schemes
 * 
 * @component
 * @example
 * // Basic usage
 * <WaterDepthCards 
 *   currentDepth={2.5}
 *   averageDepth={2.3}
 *   selectedDate={new Date()}
 * />
 * 
 * // With custom styling
 * <WaterDepthCards 
 *   currentDepth={3.1}
 *   averageDepth={2.9}
 *   selectedDate={new Date()}
 *   containerStyle={{ marginTop: 20 }}
 * />
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import PropTypes from 'prop-types';

// ===== UTILITY IMPORTS =====
import { 
  COLOR_PRIMARY,
  COLOR_MAIN_SECONDARY 
} from '../../tools/constant';

/**
 * Component Props Interface
 * @typedef {Object} WaterDepthCardsProps
 * @property {number|string} currentDepth - Current water depth reading in meters
 * @property {number|string} averageDepth - Daily average water depth in meters
 * @property {Date} selectedDate - Selected date for average calculation
 * @property {Object} [containerStyle] - Additional styling for the main container
 * @property {string} [testID] - Test identifier for testing purposes
 */

// ===== CONSTANTS =====
const CARD_GRADIENT_COLORS = {
  current: COLOR_PRIMARY,
  average: COLOR_MAIN_SECONDARY
};

const STATUS_INDICATORS = {
  live: {
    color: '#4CAF50',
    text: 'LIVE DATA',
    icon: 'circle'
  },
  stable: {
    color: 'rgba(255,255,255,0.95)',
    text: 'STABLE',
    icon: 'trending-up'
  }
};

// ===== HELPER FUNCTIONS =====
const formatDepthValue = (depth) => {
  if (!depth || depth === 0) return '0.0';
  return typeof depth === 'number' ? depth.toFixed(1) : depth.toString();
};

const formatSelectedDate = (date) => {
  return moment(date).format('DD MMM YYYY');
};

// ===== COMPONENT STYLES =====
const styles = StyleSheet.create({
  // Container styles
  container: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: 5,
    marginBottom: 25,
    marginTop: 15,
  },
  
  // Card base styles
  card: {
    width: "48%",
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  currentCard: {
    backgroundColor: COLOR_PRIMARY,
    shadowColor: COLOR_PRIMARY,
  },
  averageCard: {
    backgroundColor: COLOR_MAIN_SECONDARY,
    shadowColor: COLOR_MAIN_SECONDARY,
  },
  
  // Header styles
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  cardTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '400',
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 10,
  },
  
  // Value display styles
  valueContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  mainValue: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1.5,
  },
  unit: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
    marginBottom: 6,
  },
  
  // Status indicator styles
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 11,
    fontWeight: '600',
  },
});

// ===== COMPONENT RENDERERS =====
const renderDepthCard = ({
  type,
  title,
  subtitle,
  depth,
  icon,
  statusType
}) => {
  const cardStyle = type === 'current' ? styles.currentCard : styles.averageCard;
  const status = STATUS_INDICATORS[statusType];

  return (
    <View style={[styles.card, cardStyle]}>
      {/* Header with Icon */}
      <View style={styles.cardHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.cardTitle}>
            {title}
          </Text>
          <Text style={styles.cardSubtitle}>
            {subtitle}
          </Text>
        </View>
        
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name={icon}
            size={24} 
            color="rgba(255,255,255,0.95)" 
          />
        </View>
      </View>

      {/* Value Display */}
      <View style={styles.valueContainer}>
        <View style={styles.valueRow}>
          <Text style={styles.mainValue}>
            {formatDepthValue(depth)}
          </Text>
          <Text style={styles.unit}>
            m
          </Text>
        </View>
      </View>

      {/* Status Indicator */}
      <View style={styles.statusContainer}>
        {statusType === 'live' ? (
          <View style={[
            styles.statusDot,
            { backgroundColor: status.color }
          ]} />
        ) : (
          <MaterialCommunityIcons 
            name={status.icon}
            size={14} 
            color={status.color}
            style={{ marginRight: 6 }}
          />
        )}
        <Text style={styles.statusText}>
          {status.text}
        </Text>
      </View>
    </View>
  );
};

// ===== MAIN COMPONENT =====
const WaterDepthCards = ({
  currentDepth = 0,
  averageDepth = 0,
  selectedDate = new Date(),
  containerStyle = {},
  testID = 'water-depth-cards',
  ...otherProps
}) => {
  // Validation
  if (currentDepth === null || averageDepth === null) {
    console.warn('WaterDepthCards: currentDepth and averageDepth should not be null');
  }

  return (
    <View 
      style={[styles.container, containerStyle]} 
      testID={testID}
      {...otherProps}
    >
      {/* Current Water Depth Card */}
      {renderDepthCard({
        type: 'current',
        title: 'CURRENT DEPTH',
        subtitle: 'Last 1 hour reading',
        depth: currentDepth,
        icon: 'waves',
        statusType: 'live'
      })}

      {/* Average Water Depth Card */}
      {renderDepthCard({
        type: 'average',
        title: 'DAILY AVERAGE',
        subtitle: formatSelectedDate(selectedDate),
        depth: averageDepth,
        icon: 'chart-line-variant',
        statusType: 'stable'
      })}
    </View>
  );
};

// ===== PROP TYPES =====
WaterDepthCards.propTypes = {
  currentDepth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  averageDepth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  containerStyle: PropTypes.object,
  testID: PropTypes.string,
};

// ===== DEFAULT PROPS =====
WaterDepthCards.defaultProps = {
  currentDepth: 0,
  averageDepth: 0,
  selectedDate: new Date(),
  containerStyle: {},
  testID: 'water-depth-cards',
};

export default WaterDepthCards;