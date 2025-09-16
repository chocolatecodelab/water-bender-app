/**
 * Dashboard Screen Component
 * 
 * Main dashboard for water monitoring application displaying real-time water level data,
 * historical trends, and forecast predictions through interactive charts.
 * 
 * Features:
 * - Real-time water depth monitoring (latest reading + average)
 * - Interactive date selection for historical data analysis
 * - Multiple chart types: Period, Daily/Hourly, Monthly views
 * - Water level forecasting with visual indicators
 * - Responsive chart sizing and real-time performance
 * - Fresh data processing for accurate monitoring
 * 
 * Chart Types:
 * - Period Chart: Water surface trends over selected date range
 * - Daily/Hourly Chart: 24-hour water level with forecast overlay
 * - Monthly Chart: Long-term water level patterns
 * 
 * @file src/screens/dashboard/Dashboard.js
 * @version 2.1.0
 * @author Water Monitoring Team
 */

import React, { Fragment, useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, ScrollView, Text, Dimensions, RefreshControl } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { LineChart } from "react-native-gifted-charts"
import moment from 'moment'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// ===== COMPONENT IMPORTS =====
import { 
  BaseScreen, 
  BodyLarge, 
  Body, 
  BodySmall, 
  MyHeader, 
  MyModal, 
  H2, 
  MyModalInfo, 
  DatePicker, 
  MyModalConfirm 
} from "../../components"

// ===== UTILITY IMPORTS =====
import { 
  COLOR_BLACK, 
  COLOR_DISABLED, 
  COLOR_ERROR, 
  COLOR_GRAY_1, 
  COLOR_GRAY_2, 
  COLOR_MAIN_SECONDARY, 
  COLOR_PRIMARY, 
  COLOR_TRANSPARENT_DARK, 
  COLOR_WHITE 
} from '../../tools/constant'
import { 
  getScreenDimension, 
  iPad, 
  ios, 
  iconTools 
} from '../../tools/helper'
import { 
  calculateDynamicSpacing, 
  calculateChartWidth, 
  calculateMaxValue, 
  chartPresets, 
  createPointerConfig,
} from '../../tools/chartUtils'

// ===== CHART DATA PROCESSING =====
import {
  generateChartData, 
  generateDailyChartWithForecast,
  getLineSegmentColors,
  getSegmentedAreaColors,
  getDataPointLineColors
} from './dataChart'

// ===== HELPER COMPONENTS =====

/**
 * Render empty state component when no data available
 * @returns {JSX.Element} Empty state component
 */
const renderEmptyComponent = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: '70%' }}>
    <BodyLarge>No items to display</BodyLarge>
  </View>
);

/**
 * Chart Loading Component with skeleton animation
 * @param {string} chartType - Type of chart (period, monthly, hourly)
 * @param {string} title - Chart title
 * @param {string} subtitle - Chart subtitle
 * @returns {JSX.Element} Loading state component
 */
const ChartLoadingSkeleton = ({ chartType, title, subtitle }) => (
  <View style={[styles.card, { marginTop: 20 }]}>
    {/* Loading Header */}
    <View style={{ width: "100%", marginTop: 10, marginBottom: 20 }}>
      <View style={{
        backgroundColor: 'rgba(221, 87, 70, 0.1)',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center'
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ActivityIndicator size="small" color={COLOR_MAIN_SECONDARY} style={{ marginRight: 8 }} />
          <Text style={{
            fontSize: 15,
            fontWeight: '600',
            color: COLOR_MAIN_SECONDARY,
            textAlign: 'center'
          }}>
            {title}
          </Text>
        </View>
        {subtitle && (
          <Text style={{
            fontSize: 12,
            color: 'rgba(221, 87, 70, 0.7)',
            marginTop: 4,
            textAlign: 'center'
          }}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
    
    {/* Loading Info Panel */}
    <View style={{
      marginBottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      backgroundColor: 'rgba(248, 250, 252, 0.8)',
      borderRadius: 12,
      paddingVertical: 12
    }}>
      <View style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8
        }}>
          <MaterialCommunityIcons 
            name="database-sync" 
            size={16} 
            color={COLOR_PRIMARY} 
            style={{ marginRight: 8 }}
          />
          <View style={[
            styles.loadingSkeleton,
            { height: 12, width: 120, borderRadius: 6 }
          ]} />
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <MaterialCommunityIcons 
            name="clock-outline" 
            size={16} 
            color={COLOR_PRIMARY} 
            style={{ marginRight: 8 }}
          />
          <View style={[
            styles.loadingSkeleton,
            { height: 10, width: 80, borderRadius: 5 }
          ]} />
        </View>
      </View>
      
      <View style={{
        backgroundColor: 'rgba(255, 165, 0, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 165, 0, 0.3)',
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <View style={{
          width: 6,
          height: 6,
          backgroundColor: 'orange',
          borderRadius: 3,
          marginRight: 6
        }} />
        <Text style={{
          fontSize: 10,
          color: 'orange',
          fontWeight: '600'
        }}>
          LOADING
        </Text>
      </View>
    </View>

    {/* Loading Chart Area */}
    <View style={{
      backgroundColor: 'rgba(248, 250, 252, 0.6)',
      borderRadius: 12,
      marginHorizontal: 5,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: getScreenDimension().height / 2.5,
      borderWidth: 1,
      borderColor: 'rgba(226, 232, 240, 0.4)'
    }}>
      {/* Animated Loading Icon */}
      <View style={{
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        borderRadius: 50,
        padding: 20,
        marginBottom: 16
      }}>
        <MaterialCommunityIcons 
          name={
            chartType === 'Period' ? 'chart-timeline' :
            chartType === 'Monthly' ? 'chart-bar' : 'chart-line'
          }
          size={40} 
          color={COLOR_PRIMARY}
          style={{ opacity: 0.6 }}
        />
      </View>
      
      {/* Loading Text */}
      <ActivityIndicator size="large" color={COLOR_PRIMARY} style={{ marginBottom: 16 }} />
      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: COLOR_GRAY_2,
        textAlign: 'center',
        marginBottom: 8
      }}>
        Loading {chartType} Data
      </Text>
      <Text style={{
        fontSize: 12,
        color: 'rgba(107, 114, 128, 0.8)',
        textAlign: 'center',
        lineHeight: 18
      }}>
        Fetching water monitoring data...{'\n'}This may take a few moments
      </Text>
      
      {/* Loading Progress Skeleton */}
      <View style={{
        width: '80%',
        marginTop: 20,
        gap: 8
      }}>
        {[40, 60, 30].map((width, index) => (
          <View key={index} style={[
            styles.loadingSkeleton,
            { height: 4, width: `${width}%`, borderRadius: 2 }
          ]} />
        ))}
      </View>
    </View>
    
    {/* Loading Footer */}
    <View style={{
      marginTop: 20,
      paddingHorizontal: 15,
      paddingVertical: 12,
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: COLOR_PRIMARY,
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      <MaterialCommunityIcons 
        name="information-outline" 
        size={16} 
        color={COLOR_PRIMARY}
        style={{ marginRight: 8 }}
      />
      <Text style={{
        fontSize: 12,
        color: 'rgba(25, 118, 210, 0.8)',
        fontStyle: 'italic',
        flex: 1
      }}>
        Chart will display automatically once data is loaded • Please wait
      </Text>
    </View>
  </View>
);

// ===== MAIN DASHBOARD COMPONENT =====

/**
 * Dashboard Component
 * 
 * Main dashboard screen component that displays water monitoring data
 * with interactive charts and real-time updates.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.waterBenderAvgDistance - Average distance data array
 * @param {number} props.waterBenderLast - Latest water depth reading
 * @param {number} props.waterBenderAvg - Average water depth for selected date
 * @param {Array} props.waterBenderMonthly - Monthly water data array
 * @param {Array} props.waterBenderPeriod - Period-based water data array
 * @param {Array} props.waterBenderDaily - Daily hourly water data array
 * @param {Array} props.waterBenderForecast - Water forecast data array
 * @param {Function} props.onAppear - Callback when component appears with date range
 * @param {boolean} props.isLoading - General loading state
 * @param {boolean} props.isForecastLoading - Forecast-specific loading state
 * @param {Function} props.onLogoutPressed - Logout callback handler
 * @returns {JSX.Element} Dashboard screen component
 */
const Dashboard = ({ 
  waterBenderAvgDistance, 
  waterBenderLast, 
  waterBenderAvg, 
  waterBenderMonthly, 
  waterBenderPeriod, 
  waterBenderDaily, 
  waterBenderForecast, 
  onAppear, 
  onRefreshAllData,
  isLoading, 
  isForecastLoading, 
  onLogoutPressed 
}) => {
  // ===== STATE MANAGEMENT =====
  
  /** @type {[Date, Function]} Date selection states */
  const [startDate, setStartDate] = useState(new Date())
  const [finishDate, setFinishDate] = useState(new Date())
  
  /** @type {[boolean, Function]} Modal visibility states */
  const [modalStartDate, setModalStartDate] = useState(false)
  const [showModalInfo, setShowModalInfo] = useState(false)
  const [modalConfirm, setModalConfirm] = useState('')
  
  /** @type {[string, Function]} Info message state */
  const [messageInfo, setMessageInfo] = useState('')

  /** @type {[boolean, Function]} Pull to refresh state */
  const [isRefreshing, setIsRefreshing] = useState(false)

  // ===== API OPTIMIZATION STATE =====
  const [dataCache, setDataCache] = useState({
    lastLoaded: null,
    dailyLoaded: false,
    monthlyYear: null,
    forecastLoaded: false
  })

  // ===== RESPONSIVE LAYOUT DETECTION =====
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'))
  const isLandscape = screenDimensions.width > screenDimensions.height

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window)
    })
    return () => subscription?.remove()
  }, [])

  // ===== CHART DATA PROCESSING =====
  
  /** 
   * Chart data variables - processed from raw API data
   * These variables will hold the processed chart data for different chart types
   */
  let generateChartWaterBenderAvgDistance, 
      generateChartWaterBenderPeriod, 
      generateChartWaterBenderMonthly

  /**
   * Process chart data for Period, Monthly charts
   * Only process if all required data is available
   */
  if(waterBenderAvgDistance && waterBenderLast && waterBenderAvg && waterBenderMonthly && waterBenderPeriod) {
    generateChartWaterBenderAvgDistance = generateChartData(waterBenderAvgDistance, 1);
    generateChartWaterBenderPeriod = generateChartData(waterBenderPeriod, 2);
    generateChartWaterBenderMonthly = generateChartData(waterBenderMonthly, 3);
  }

  // ===== OPTIMIZED REAL-TIME CHART GENERATION =====
  
  /**
   * PERFORMANCE OPTIMIZED: Simplified chart processing
   * Removed React.useMemo overhead, using direct processing like Period/Monthly charts
   * This eliminates dual dependency complexity and improves rendering performance
   */
  const generateChartWaterBenderDailyWithForecast = (() => {
    if (!waterBenderDaily) {
      console.log('⚠️ No daily water data available');
      return [];
    }

    console.log('📊 Processing optimized chart data for daily/hourly with forecast...');
    
    // Direct processing without memoization overhead
    let chartData;
    if (waterBenderForecast && waterBenderForecast.length > 0) {
      console.log('🔮 Generating combined chart with forecast data');
      chartData = generateDailyChartWithForecast(waterBenderDaily, waterBenderForecast);
    } else {
      console.log('📈 Generating chart with actual data only');
      chartData = generateChartData(waterBenderDaily, 1);
    }
    
    console.log('✅ Optimized chart data processing completed:', {
      totalPoints: chartData.length,
      actualPoints: chartData.filter(d => d.isActual).length,
      forecastPoints: chartData.filter(d => d.isForecast).length
    });
    
    return chartData;
  })();

  // ===== COMPONENT LIFECYCLE EFFECTS =====
  
  /**
   * OPTIMIZED: Smart data loading - hanya panggil API yang diperlukan
   * Menghindari duplikasi API call dan menggunakan caching untuk data yang tidak berubah
   */
  useEffect(() => {
    const currentYear = moment(startDate).format('YYYY')
    const today = moment().format('YYYY-MM-DD')
    const selectedDate = moment(startDate).format('YYYY-MM-DD')
    
    console.log('📊 Smart API Loading - Checking what needs to be loaded:', {
      selectedDate,
      currentYear,
      isToday: selectedDate === today,
      cacheState: dataCache
    })

    // Panggil onAppear dengan flag untuk menentukan API mana yang perlu dipanggil
    onAppear(startDate, finishDate, {
      needsLastData: !dataCache.lastLoaded,
      needsDailyData: !dataCache.dailyLoaded && selectedDate === today,
      needsMonthlyData: dataCache.monthlyYear !== currentYear,
      needsForecastData: !dataCache.forecastLoaded && selectedDate === today
    })

    // Update cache state
    setDataCache(prev => ({
      ...prev,
      lastLoaded: !prev.lastLoaded ? new Date().toISOString() : prev.lastLoaded,
      dailyLoaded: selectedDate === today ? true : prev.dailyLoaded,
      monthlyYear: currentYear,
      forecastLoaded: selectedDate === today ? true : prev.forecastLoaded
    }))
  }, [startDate, finishDate])

  /**
   * OPTIMIZED: Reset cache ketika user logout atau refresh manual
   */
  const resetDataCache = () => {
    setDataCache({
      lastLoaded: null,
      dailyLoaded: false,
      monthlyYear: null,
      forecastLoaded: false
    })
  }

  // ===== HELPER FUNCTIONS =====
  
  /**
   * Handle modal confirmations and actions
   */
  const handleLogoutConfirm = () => {
    // Reset cache sebelum logout untuk session berikutnya
    resetDataCache();
    setModalConfirm(false);
    onLogoutPressed();
  };

  const handleModalStartDateToggle = () => {
    setModalStartDate(!modalStartDate);
  };

  const handleInfoModal = (message) => {
    setMessageInfo(message);
    setShowModalInfo(true);
  };

  /**
   * OPTIMIZED: Handle manual refresh dengan cache reset
   */
  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered - resetting cache');
    resetDataCache();
    
    // Force refresh all data
    if (onRefreshAllData) {
      onRefreshAllData(startDate, finishDate);
    }
  };

  /**
   * Handle pull-to-refresh action
   * Refreshes all data and resets cache
   */
  const onPullToRefresh = async () => {
    console.log('📱 Pull-to-refresh triggered');
    setIsRefreshing(true);
    
    try {
      // Reset cache untuk memaksa reload semua data
      resetDataCache();
      
      // Call refresh function dengan force reload
      if (onRefreshAllData) {
        await onRefreshAllData(startDate, finishDate, true); // true untuk force refresh
      }
      
      console.log('✅ Pull-to-refresh completed successfully');
    } catch (error) {
      console.error('❌ Pull-to-refresh failed:', error);
    } finally {
      // Set delay minimum untuk user experience yang baik
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  // ===== RENDER METHODS =====
  
  /**
   * Render modern water depth info cards with enhanced design
   * @returns {JSX.Element} Enhanced water depth cards component
   */
  const renderWaterDepthCards = () => (
    <View style={{ 
      justifyContent: "space-evenly", 
      flexDirection: "row", 
      justifyContent: "space-between",
      marginHorizontal: 5,
      marginBottom: 25,
      marginTop: 15
    }}>
      {/* Latest Water Depth Card */}
      <View style={[
        styles.modernCard,
        { 
          width: "48%",
          backgroundColor: COLOR_PRIMARY,
          borderRadius: 20,
          padding: 20,
          shadowColor: COLOR_PRIMARY,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 15,
          elevation: 8,
        }
      ]}>
        {/* Header with Icon */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: 16 
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ 
              color: 'rgba(255,255,255,0.9)',
              fontSize: 12,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: 0.8
            }}>
              CURRENT DEPTH
            </Text>
            <Text style={{ 
              color: 'rgba(255,255,255,0.7)',
              fontSize: 10,
              marginTop: 2,
              fontWeight: '400'
            }}>
              Last 1 hour reading
            </Text>
          </View>
          
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 12,
            padding: 10,
          }}>
            <MaterialCommunityIcons 
              name="waves"
              size={24} 
              color="rgba(255,255,255,0.95)" 
            />
          </View>
        </View>

        {/* Value Display */}
        <View style={{ alignItems: 'flex-start', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={{ 
              color: '#FFFFFF',
              fontSize: 34,
              fontWeight: '800',
              letterSpacing: -1.5
            }}>
              {waterBenderLast || '0.0'}
            </Text>
            <Text style={{ 
              color: 'rgba(255,255,255,0.8)',
              fontSize: 16,
              fontWeight: '600',
              marginLeft: 6,
              marginBottom: 6
            }}>
              m
            </Text>
          </View>
        </View>

        {/* Status Indicator */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: 25,
          paddingHorizontal: 12,
          paddingVertical: 8,
          alignSelf: 'flex-start'
        }}>
          <View style={{
            width: 8,
            height: 8,
            backgroundColor: '#4CAF50',
            borderRadius: 4,
            marginRight: 8
          }} />
          <Text style={{ 
            color: 'rgba(255,255,255,0.95)',
            fontSize: 11,
            fontWeight: '600'
          }}>
            LIVE DATA
          </Text>
        </View>
      </View>

      {/* Average Water Depth Card - Modern Design */}
      <View style={[
        styles.modernCard,
        { 
          width: "48%",
          backgroundColor: COLOR_MAIN_SECONDARY,
          borderRadius: 20,
          padding: 20,
          shadowColor: COLOR_MAIN_SECONDARY,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 15,
          elevation: 8,
        }
      ]}>
        {/* Header with Icon */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: 16 
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ 
              color: 'rgba(255,255,255,0.9)',
              fontSize: 12,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: 0.8
            }}>
              DAILY AVERAGE
            </Text>
            <Text style={{ 
              color: 'rgba(255,255,255,0.7)',
              fontSize: 10,
              marginTop: 2,
              fontWeight: '400'
            }}>
              {moment(startDate).format('DD MMM YYYY')}
            </Text>
          </View>
          
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 12,
            padding: 10,
          }}>
            <MaterialCommunityIcons 
              name="chart-line-variant"
              size={24} 
              color="rgba(255,255,255,0.95)" 
            />
          </View>
        </View>

        {/* Value Display */}
        <View style={{ alignItems: 'flex-start', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={{ 
              color: '#FFFFFF',
              fontSize: 34,
              fontWeight: '800',
              letterSpacing: -1.5
            }}>
              {waterBenderAvg || '0.0'}
            </Text>
            <Text style={{ 
              color: 'rgba(255,255,255,0.8)',
              fontSize: 16,
              fontWeight: '600',
              marginLeft: 6,
              marginBottom: 6
            }}>
              m
            </Text>
          </View>
        </View>

        {/* Trend Indicator */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: 25,
          paddingHorizontal: 12,
          paddingVertical: 8,
          alignSelf: 'flex-start'
        }}>
          <MaterialCommunityIcons 
            name="trending-up" 
            size={14} 
            color="rgba(255,255,255,0.95)" 
            style={{ marginRight: 6 }}
          />
          <Text style={{ 
            color: 'rgba(255,255,255,0.95)',
            fontSize: 11,
            fontWeight: '600'
          }}>
            STABLE
          </Text>
        </View>
      </View>
    </View>
  );

  /**
   * Render modern date selection section
   */
  const renderDateSelection = () => (
    <View style={styles.modernDateSection}>
      {/* Section Header */}
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
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 15,
            paddingHorizontal: 12,
            paddingVertical: 6
          }}>
            <ActivityIndicator size="small" color={COLOR_WHITE} style={{ marginRight: 6 }} />
            <Text style={{
              fontSize: 12,
              color: COLOR_WHITE,
              fontWeight: '600'
            }}>
              Refreshing...
            </Text>
          </View>
        )}
      </View>

      {/* Modern Date Selector Card - Hidden in Landscape for Better Space Usage */}
      {!isLandscape && (
        <View style={styles.dateCard}>
          <TouchableOpacity 
            style={styles.dateSelector}
            onPress={handleModalStartDateToggle}
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
                  {moment(startDate).format('DD MMMM YYYY')}
                </Text>
                <View style={styles.dateRangeTag}>
                  <Text style={styles.dateRangeText}>3-day range</Text>
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

          {/* Quick Date Filters */}
          <View style={styles.quickFilters}>
            <Text style={styles.quickFiltersTitle}>Quick Select:</Text>
            <View style={styles.quickFiltersRow}>
              {[
                { label: 'Today', days: 0 },
                { label: 'Yesterday', days: -1 },
                { label: 'Last Week', days: -7 }
              ].map((filter, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickFilterButton}
                  onPress={() => {
                    const date = new Date();
                    date.setDate(date.getDate() + filter.days);
                    setStartDate(date);
                    const finishDate = new Date(date);
                    finishDate.setDate(finishDate.getDate() + 3);
                    setFinishDate(finishDate);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickFilterText}>{filter.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );

  // ===== MAIN RENDER =====
  
  return (
    <BaseScreen
      barBackgroundColor={COLOR_PRIMARY}
      statusBarColor={COLOR_WHITE}
      translucent
      containerStyle={{ 
        paddingTop: iPad ? 10 : ios ? 30 : 20, 
        paddingBottom: 0, 
        backgroundColor: COLOR_PRIMARY 
      }}
    >
      {/* Header Section */}
      <MyHeader
        pageTitle='Dashboard'
        rightButton
        iconType={iconTools.MaterialCommunityIcons}
        iconName={'logout'}
        onRightPressed={() => setModalConfirm(true)}
      />
      
      {/* Main Content Container */}
      <View style={{ paddingHorizontal: 20 }}>
        {/* Pull-to-Refresh Hint */}
        {!isRefreshing && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 20,
          }}>
            <MaterialCommunityIcons 
              name="gesture-swipe-down" 
              size={14} 
              color="rgba(255,255,255,0.8)" 
              style={{ marginRight: 6 }}
            />
            <Text style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.8)',
              fontWeight: '500',
              textAlign: 'center'
            }}>
              Pull down to refresh all data
            </Text>
          </View>
        )}
        
        {/* Scrollable Content with Pull-to-Refresh */}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onPullToRefresh}
              colors={[COLOR_PRIMARY, COLOR_MAIN_SECONDARY]}
              tintColor={COLOR_PRIMARY}
              title="Pull to refresh data..."
              titleColor={COLOR_GRAY_2}
              progressBackgroundColor={COLOR_WHITE}
            />
          }
        >
        {/* Date Selection Section */}
        {renderDateSelection()}
        
          <View style={{ 
            width: '100%', 
            justifyContent: 'center', 
            marginBottom: 100,
          }}>
            
            {/* Water Depth Info Cards */}
            {renderWaterDepthCards()}
            
            {/* Charts Section */}
            {!isLoading ? (
              <View>
                {/* Period Chart Section */}
                {generateChartWaterBenderPeriod && generateChartWaterBenderPeriod.length > 0 ? (
                  <View style={[styles.card, { marginTop: 20 }]}>
                    <View style={{ width: "100%", marginTop: 10 }}>
                      <Text style={{ 
                        bottom: 24, 
                        padding: 7, 
                        textAlign: "center", 
                        borderRadius: 3, 
                        fontWeight: "bold", 
                        fontSize: 15, 
                        backgroundColor: COLOR_MAIN_SECONDARY, 
                        color: COLOR_WHITE 
                      }}>
                        Water Surface By Period
                      </Text>
                    </View>
                  
                  {/* Chart Info */}
                  <View style={{
                    marginTop: 10,
                    marginBottom: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 12,
                        color: COLOR_GRAY_2,
                        fontWeight: '500'
                      }}>
                        📊 Period Data Points: {(generateChartWaterBenderPeriod || []).length}
                      </Text>
                      <Text style={{
                        fontSize: 11,
                        color: COLOR_GRAY_2,
                        marginTop: 2
                      }}>
                        Date Range: {moment(startDate).format('DD MMM')} - {moment(finishDate).format('DD MMM')}
                      </Text>
                    </View>
                    
                    <View style={{
                      backgroundColor: 'rgba(221, 87, 70, 0.1)',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 15,
                      borderWidth: 1,
                      borderColor: 'rgba(221, 87, 70, 0.2)'
                    }}>
                      <Text style={{
                        fontSize: 10,
                        color: COLOR_MAIN_SECONDARY,
                        fontWeight: 'bold',
                        textAlign: 'center'
                      }}>
                        PERIOD
                      </Text>
                    </View>
                  </View>

                  {/* Responsive Chart Container with Horizontal Scroll */}
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={true}
                    style={{
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
                    }}
                    contentContainerStyle={{
                      padding: 15,
                      minWidth: getScreenDimension().width - 10
                    }}
                  >
                    <LineChart
                      areaChart
                      curved
                      noOfSections={6}
                      spacing={Math.max(80, Math.min(100, getScreenDimension().width / Math.max(generateChartWaterBenderPeriod?.length || 1, 1)))}
                      data={generateChartWaterBenderPeriod}
                      yAxisLabelWidth={60}
                      maxValue={calculateMaxValue(generateChartWaterBenderPeriod || [])}
                      xAxisThickness={1}
                      yAxisThickness={1}
                      yAxisTextStyle={{ color: COLOR_GRAY_2, fontSize: 12, fontWeight: '500' }}
                      xAxisLabelTextStyle={{ 
                        color: COLOR_GRAY_2, 
                        textAlign: 'center', 
                        fontSize: 8, 
                        fontWeight: '400',
                        width: 60,
                        flexWrap: 'wrap'
                      }}
                      width={Math.max(
                        getScreenDimension().width - 80,
                        (generateChartWaterBenderPeriod || []).length * 100 + 100
                      )}
                      height={getScreenDimension().height / 1.8} // Tinggi lebih besar untuk accommodate multiline labels
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
                      pointerConfig={createPointerConfig(chartPresets.colors, 'period')}
                      initialSpacing={10}
                      endSpacing={20}
                    />
                  </ScrollView>
                  
                  {/* Additional Info */}
                  <View style={{
                    marginTop: 15,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: 'rgba(221, 87, 70, 0.05)',
                    borderRadius: 8,
                    borderLeftWidth: 4,
                    borderLeftColor: COLOR_MAIN_SECONDARY
                  }}>
                    <Text style={{
                      fontSize: 12,
                      color: COLOR_GRAY_2,
                      fontStyle: 'italic',
                      textAlign: 'center'
                    }}>
                      📊 Swipe/Tap on chart for detailed values • Period-based water surface data
                    </Text>
                  </View>
                </View>
                ) : (
                  <ChartLoadingSkeleton 
                    chartType="Period"
                    title="Loading Water Surface By Period"
                    subtitle="Processing period-based water surface data"
                  />
                )}

                {/* Monthly Chart Section */}
                {generateChartWaterBenderMonthly && generateChartWaterBenderMonthly.length > 0 ? (
                <View style={[styles.card, { marginTop: 20 }]}>
                  <View style={{ width: "100%", marginTop: 10 }}>
                    <Text style={{ 
                      bottom: 24, 
                      padding: 7, 
                      textAlign: "center", 
                      borderRadius: 3, 
                      fontWeight: "bold", 
                      fontSize: 15, 
                      backgroundColor: COLOR_MAIN_SECONDARY, 
                      color: COLOR_WHITE 
                    }}>
                      Water Surface By Monthly
                    </Text>
                  </View>
                  
                  {/* Chart Info */}
                  <View style={{
                    marginTop: 10,
                    marginBottom: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 12,
                        color: COLOR_GRAY_2,
                        fontWeight: '500'
                      }}>
                        📊 Monthly Data Points: {(generateChartWaterBenderMonthly || []).length}
                      </Text>
                      <Text style={{
                        fontSize: 11,
                        color: COLOR_GRAY_2,
                        marginTop: 2
                      }}>
                        Year Overview: {moment().format('YYYY')}
                      </Text>
                    </View>
                    
                    <View style={{
                      backgroundColor: 'rgba(221, 87, 70, 0.1)',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 15,
                      borderWidth: 1,
                      borderColor: 'rgba(221, 87, 70, 0.2)'
                    }}>
                      <Text style={{
                        fontSize: 10,
                        color: COLOR_MAIN_SECONDARY,
                        fontWeight: 'bold',
                        textAlign: 'center'
                      }}>
                        MONTHLY
                      </Text>
                    </View>
                  </View>

                  {/* Responsive Chart Container with Horizontal Scroll */}
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={true}
                    style={{
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
                    }}
                    contentContainerStyle={{
                      padding: 15,
                      minWidth: getScreenDimension().width - 10
                    }}
                  >
                    <LineChart
                      areaChart
                      curved
                      noOfSections={6}
                      spacing={Math.max(70, Math.min(90, getScreenDimension().width / Math.max(generateChartWaterBenderMonthly?.length || 1, 1)))}
                      data={generateChartWaterBenderMonthly}
                      yAxisLabelWidth={60}
                      maxValue={calculateMaxValue(generateChartWaterBenderMonthly || [])}
                      xAxisThickness={1}
                      yAxisThickness={1}
                      yAxisTextStyle={{ color: COLOR_GRAY_2, fontSize: 12, fontWeight: '500' }}
                      xAxisLabelTextStyle={{ color: COLOR_GRAY_2, textAlign: 'center', fontSize: 11, fontWeight: '400' }}
                      width={Math.max(
                        getScreenDimension().width - 80,
                        (generateChartWaterBenderMonthly || []).length * 90 + 100
                      )}
                      height={getScreenDimension().height / 2.1}
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
                  <View style={{
                    marginTop: 15,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: 'rgba(221, 87, 70, 0.05)',
                    borderRadius: 8,
                    borderLeftWidth: 4,
                    borderLeftColor: COLOR_MAIN_SECONDARY
                  }}>
                    <Text style={{
                      fontSize: 12,
                      color: COLOR_GRAY_2,
                      fontStyle: 'italic',
                      textAlign: 'center'
                    }}>
                      📊 Swipe/Tap on chart for detailed values • Monthly water surface trends
                    </Text>
                  </View>
                </View>
                ) : (
                  <ChartLoadingSkeleton 
                    chartType="Monthly"
                    title="Loading Water Surface By Monthly"
                    subtitle="Processing monthly water surface trends"
                  />
                )}

                {/* Daily/Hourly Chart Section */}
                {generateChartWaterBenderDailyWithForecast && generateChartWaterBenderDailyWithForecast.length > 0 ? (
                <View style={[styles.card, { marginTop: 20, }]}>
                  <View style={{ width: "100%", marginTop: 10 }}>
                    <Text style={{ 
                      bottom: 24, 
                      padding: 7, 
                      textAlign: "center", 
                      borderRadius: 3, 
                      fontWeight: "bold", 
                      fontSize: 15, 
                      backgroundColor: COLOR_MAIN_SECONDARY, 
                      color: COLOR_WHITE 
                    }}>
                      Water Surface By Hourly (with Forecast)
                    </Text>
                  </View>
                  
                  {/* Chart Info - ADOPSI PATTERN DARI PERIOD & MONTHLY */}
                  <View style={{
                    marginTop: 10,
                    marginBottom: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 12,
                        color: COLOR_GRAY_2,
                        fontWeight: '500'
                      }}>
                        📊 Hourly Data Points: {(generateChartWaterBenderDailyWithForecast || []).length}
                      </Text>
                      <Text style={{
                        fontSize: 11,
                        color: COLOR_GRAY_2,
                        marginTop: 2
                      }}>
                        Actual: {(generateChartWaterBenderDailyWithForecast || []).filter(d => d.isActual).length} | 
                        Forecast: {(generateChartWaterBenderDailyWithForecast || []).filter(d => d.isForecast).length}
                        {isForecastLoading && <Text style={{ color: COLOR_PRIMARY }}> ⟳</Text>}
                      </Text>
                    </View>
                    
                    <View style={{
                      backgroundColor: 'rgba(221, 87, 70, 0.1)',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 15,
                      borderWidth: 1,
                      borderColor: 'rgba(221, 87, 70, 0.2)'
                    }}>
                      <Text style={{
                        fontSize: 10,
                        color: COLOR_MAIN_SECONDARY,
                        fontWeight: 'bold',
                        textAlign: 'center'
                      }}>
                        HOURLY
                      </Text>
                    </View>
                  </View>

                  {/* Responsive Chart Container - ADOPSI PATTERN DARI PERIOD & MONTHLY */}
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={true}
                    style={{
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
                    }}
                    contentContainerStyle={{
                      padding: 15,
                      minWidth: getScreenDimension().width - 10
                    }}
                  >
                    <LineChart
                      areaChart
                      curved={false}
                      noOfSections={6}
                      // ADOPSI: Responsive spacing seperti Period & Monthly charts
                      spacing={Math.max(60, Math.min(80, getScreenDimension().width / Math.max(generateChartWaterBenderDailyWithForecast?.length || 1, 1)))}
                      data={generateChartWaterBenderDailyWithForecast}
                      yAxisLabelWidth={60}
                      maxValue={calculateMaxValue(generateChartWaterBenderDailyWithForecast)}
                      // ADOPSI: Consistent width calculation seperti Period & Monthly
                      width={Math.max(
                        getScreenDimension().width - 80,
                        (generateChartWaterBenderDailyWithForecast || []).length * 70 + 100
                      )}
                      // ADOPSI: Consistent height seperti Period & Monthly 
                      height={getScreenDimension().height / 1.8}
                      xAxisThickness={1}
                      yAxisThickness={1}
                      yAxisTextStyle={{ 
                        color: COLOR_GRAY_2, 
                        fontSize: 12,
                        fontWeight: '500'
                      }}
                      xAxisLabelTextStyle={{ 
                        color: COLOR_GRAY_2, 
                        textAlign: 'center', 
                        fontSize: 11,
                        fontWeight: '400'
                      }}
                      // Multi-color support for actual vs forecast
                      startFillColor="rgb(221, 87, 70)"
                      startOpacity={0.8}
                      endFillColor="rgb(255, 122, 104)"
                      endOpacity={0.1}
                      color="rgb(221, 87, 70)"
                      // Dynamic colors berdasarkan forecast
                      dataPointsColor={(index) => {
                        if (generateChartWaterBenderDailyWithForecast[index]) {
                          return generateChartWaterBenderDailyWithForecast[index].isForecast 
                            ? COLOR_PRIMARY
                            : COLOR_MAIN_SECONDARY;
                        }
                        return COLOR_MAIN_SECONDARY;
                      }}
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
                  
                  {/* Additional Info - ADOPSI PATTERN DARI PERIOD & MONTHLY */}
                  <View style={{
                    marginTop: 15,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: 'rgba(221, 87, 70, 0.05)',
                    borderRadius: 8,
                    borderLeftWidth: 4,
                    borderLeftColor: COLOR_MAIN_SECONDARY
                  }}>
                    <Text style={{
                      fontSize: 12,
                      color: COLOR_GRAY_2,
                      fontStyle: 'italic',
                      textAlign: 'center'
                    }}>
                      📊 Swipe/Tap on chart for detailed values • Red: Real-time data • Blue: 12-hour forecast
                    </Text>
                  </View>
                </View>
                ) : (
                  <ChartLoadingSkeleton 
                    chartType="Hourly"
                    title="Loading Water Surface By Hourly (with Forecast)"
                    subtitle="Processing real-time data and forecast predictions"
                  />
                )}
              </View>
            ) : (
              /* Loading State for All Charts */
              <View>
                <ChartLoadingSkeleton 
                  chartType="Period"
                  title="Loading Water Surface By Period"
                  subtitle="Processing period-based water surface data"
                />
                <ChartLoadingSkeleton 
                  chartType="Monthly"
                  title="Loading Water Surface By Monthly"
                  subtitle="Processing monthly water surface trends"
                />
                <ChartLoadingSkeleton 
                  chartType="Hourly"
                  title="Loading Water Surface By Hourly (with Forecast)"
                  subtitle="Processing real-time data and forecast predictions"
                />
              </View>
            )}

          </View>
        </ScrollView>
      </View>
      
      {/* Modal Components */}
      <MyModalConfirm
        isVisible={modalConfirm}
        closeModal={() => setModalConfirm(false)}
        onSubmit={handleLogoutConfirm}
        message={"Apakah anda yakin ingin log out ?"}
      />
      
      {/* Enhanced Date Selection Modal */}
      <MyModal 
        isVisible={modalStartDate} 
        closeModal={() => setModalStartDate(!modalStartDate)}
        headerActive={true}
        headerTitle="Select Date Range"
        headerColor={'transparent'}
      >
        <DatePicker
          value={startDate}
          onChangeDate={setStartDate}
          onChangeFinishDate={setFinishDate}
          closeDate={() => setModalStartDate(!modalStartDate)}
        />
      </MyModal>
      {/* <MyModal isVisible={modalFinishDate} closeModal={() => setModalFinishDate(!modalFinishDate)}>
        <View style={{ maxHeight: '100%', paddingVertical: 20, paddingHorizontal: 25 }}>
          <DatePicker
            value={finishDate}
            onChangeDate={setFinishDate}
            closeDate={() => setModalFinishDate(!modalFinishDate)}
          />
        </View>
      </MyModal> */}
      {/* Info Modal */}
      <MyModalInfo
        isVisible={showModalInfo}
        closeModal={() => {
          setShowModalInfo(!showModalInfo);
          setMessageInfo('');
        }}
        message={messageInfo}
      />
    </BaseScreen>
  );
};

// ===== COMPONENT EXPORT =====
export default Dashboard;

// ===== COMPONENT STYLES =====

/**
 * StyleSheet untuk Dashboard component
 * Menggunakan consistent styling patterns dan responsive design
 */

/**
 * StyleSheet untuk Dashboard component
 * Menggunakan consistent styling patterns dan responsive design
 */
const styles = StyleSheet.create({
  /** Main card container style untuk chart sections */
  card: {
    borderWidth: 1,
    borderColor: COLOR_TRANSPARENT_DARK,
    marginTop: -20,
    paddingVertical: 30,
    paddingBottom: 40,
    marginBottom: 15,
    backgroundColor: COLOR_WHITE,
    shadowColor: COLOR_BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: 10,
    padding: 15
  },
  containerFilterDate: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderBottomWidth: 1,
    borderBottomColor: COLOR_DISABLED,
    paddingBottom: 15
  },
  buttonFilter: (monthDateActive) => ({
    flexDirection: "row",
    height: 45,
    borderWidth: 1,
    alignItems: 'center',
    borderRadius: 8,
    borderColor: COLOR_GRAY_1,
    backgroundColor: monthDateActive ? COLOR_PRIMARY : COLOR_WHITE
  }),
  textFilterDate: {
    color: COLOR_GRAY_2,
    fontSize: 16,
    marginBottom: -10,
    marginLeft: 10,
    zIndex: 1,
    backgroundColor: COLOR_WHITE,
    width: "50%"
  },
  line: {
    height: 8,
    width: 8,
    borderRadius: 8,
    backgroundColor: COLOR_DISABLED,
  },
  textBarTopComponent: {
    fontWeight: "bold",
    color: COLOR_BLACK,
    fontSize: 8,
    marginBottom: 6
  },
  cardColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // padding: 10,
    marginTop: 5
  },
  filterByCard: (filterBy, value) => ({
    width: '48%',
    height: 40,
    shadowColor: COLOR_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: filterBy === value ? COLOR_PRIMARY : COLOR_TRANSPARENT_DARK,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: filterBy === value ? COLOR_PRIMARY : COLOR_WHITE,
  }),
  
  // ===== MODERN DATE SELECTION STYLES =====
  modernDateSection: {
    marginBottom: 20,
    marginHorizontal: 10,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR_WHITE,
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  
  dateCard: {
    backgroundColor: COLOR_WHITE,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLOR_BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  
  dateSelector: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(25, 118, 210, 0.15)',
    backgroundColor: 'rgba(25, 118, 210, 0.02)',
    marginBottom: 16,
  },
  
  dateSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  
  dateIconContainer: {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    borderRadius: 12,
    padding: 10,
    marginRight: 16,
  },
  
  dateTextContainer: {
    flex: 1,
  },
  
  dateLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.6)',
    marginBottom: 4,
  },
  
  dateValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLOR_BLACK,
    marginBottom: 6,
  },
  
  dateRangeTag: {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  
  dateRangeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLOR_PRIMARY,
  },
  
  chevronContainer: {
    marginLeft: 12,
  },
  
  quickFilters: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: 16,
  },
  
  quickFiltersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR_BLACK,
    marginBottom: 12,
  },
  
  quickFiltersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  
  quickFilterButton: {
    backgroundColor: 'rgba(25, 118, 210, 0.06)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(25, 118, 210, 0.15)',
    flex: 1,
  },
  
  quickFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLOR_PRIMARY,
    textAlign: 'center',
  },
  
  // ===== LOADING SKELETON STYLES =====
  loadingSkeleton: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    opacity: 0.6,
  },
})