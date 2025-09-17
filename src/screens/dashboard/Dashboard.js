/**
 * Dashboard Screen Component - Modular Architecture
 * 
 * A highly optimized water monitoring dashboard featuring modular component architecture,
 * custom hooks for state management, and responsive design patterns.
 * 
 * Architecture Features:
 * - Modular component structure (extracted from 1729 to 685 lines)
 * - Custom hooks for state management and data processing
 * - Reusable chart components with interactive tooltips
 * - Responsive design with screen size adaptation
 * - Optimized data caching and loading strategies
 * - Clean separation of concerns following React best practices
 * 
 * Components Used:
 * - PeriodChartSection: Water surface trends over selected date range
 * - MonthlyChartSection: Long-term water level patterns  
 * - DailyHourlyChartSection: 24-hour water level with forecast overlay
 * - WaterDepthCards: Real-time depth monitoring display
 * - DateSelectionSection: Interactive date selection and filtering
 * 
 * Custom Hooks:
 * - useDateSelection: Date selection and modal management
 * - useModalManagement: Modal state and interaction handling
 * - useResponsiveLayout: Screen dimension and orientation tracking
 * - useRefreshControl: Pull-to-refresh functionality
 * - useChartData: Chart data processing and optimization
 * 
 * @file src/screens/dashboard/Dashboard.js
 * @version 3.0.0 - Modular Architecture
 * @author Water Monitoring Dashboard Team
 */

import React, { Fragment, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, ScrollView, Text, RefreshControl } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import moment from 'moment'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// ===== COMPONENT IMPORTS =====
import { 
  BaseScreen, 
  MyHeader, 
  MyModal, 
  MyModalInfo, 
  DatePicker, 
  MyModalConfirm,
  WaterDepthCards,
  DateSelectionSection,
  PeriodChartSection,
  MonthlyChartSection,
  DailyHourlyChartSection
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

// ===== CUSTOM HOOKS =====
import {
  useDateSelection,
  useModalManagement,
  useResponsiveLayout,
  useRefreshControl,
  useChartData
} from '../../hooks'

// ===== UTILITY FUNCTIONS =====
import { resetDataCache } from '../../tools/cacheUtils';
import { 
  handleQuickFilterSelect as utilHandleQuickFilter,
  handleManualRefresh as utilHandleManualRefresh
} from '../../tools/dashboardUtils';

// ===== CHART DATA PROCESSING =====
import {
  generateChartData, 
  generateDailyChartWithForecast,
  getLineSegmentColors,
  getSegmentedAreaColors,
  getDataPointLineColors
} from './dataChart'

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
  // ===== CUSTOM HOOKS INITIALIZATION =====
  const dateSelection = useDateSelection();
  const modalManagement = useModalManagement();
  const responsiveLayout = useResponsiveLayout();
  const refreshControl = useRefreshControl(onRefreshAllData);
  const chartData = useChartData({
    waterBenderAvgDistance,
    waterBenderLast,
    waterBenderAvg,
    waterBenderMonthly,
    waterBenderPeriod,
    waterBenderDaily,
    waterBenderForecast,
    startDate: dateSelection.startDate
  });

  // ===== DESTRUCTURED HOOK VALUES =====
  const { startDate, finishDate, setStartDate, setFinishDate, modalStartDate, setModalStartDate } = dateSelection;
  const { showModalInfo, modalConfirm, messageInfo, showInfoModal, hideInfoModal, hideConfirmModal } = modalManagement;
  const { isLandscape } = responsiveLayout;
  const { isRefreshing, refreshControlProps } = refreshControl;
  const { 
    generateChartWaterBenderPeriod,
    generateChartWaterBenderMonthly,
    generateChartWaterBenderDailyWithForecast,
    isChartsLoading,
    isPeriodLoading,
    setDataCache
  } = chartData;

  // ===== DEBUG CHART DATA =====
  console.log('🔍 Dashboard Chart Debug:', {
    isLoading,
    isChartsLoading,
    periodDataLength: generateChartWaterBenderPeriod?.length || 0,
    monthlyDataLength: generateChartWaterBenderMonthly?.length || 0,
    periodData: !!generateChartWaterBenderPeriod,
    monthlyData: !!generateChartWaterBenderMonthly,
    rawPeriodData: waterBenderPeriod?.length || 0,
    rawMonthlyData: waterBenderMonthly?.length || 0
  });

  // ===== DEBUG PERIOD LOADING STATE =====
  const periodLoadingState = isPeriodLoading || !generateChartWaterBenderPeriod || generateChartWaterBenderPeriod.length === 0;
  console.log('📊 Period Loading State Debug:', {
    isPeriodLoading,
    hasPeriodData: !!generateChartWaterBenderPeriod,
    periodLength: generateChartWaterBenderPeriod?.length || 0,
    finalLoadingState: periodLoadingState,
    optimizedCondition: 'Added isPeriodLoading for date changes',
    breakdown: {
      dateChangeLoading: isPeriodLoading,
      noData: !generateChartWaterBenderPeriod,
      emptyArray: generateChartWaterBenderPeriod?.length === 0
    }
  });

  // ===== DEBUG MONTHLY LOADING STATE =====
  const monthlyLoadingState = !generateChartWaterBenderMonthly || generateChartWaterBenderMonthly.length === 0;
  console.log('📊 Monthly Loading State Debug:', {
    isChartsLoading,
    hasMonthlyData: !!generateChartWaterBenderMonthly,
    monthlyLength: generateChartWaterBenderMonthly?.length || 0,
    finalLoadingState: monthlyLoadingState,
    optimizedCondition: 'Removed isChartsLoading dependency',
    breakdown: {
      noData: !generateChartWaterBenderMonthly,
      emptyArray: generateChartWaterBenderMonthly?.length === 0
    }
  });

  // ===== COMPONENT LIFECYCLE EFFECTS =====
  
  /**
   * OPTIMIZED: Smart data loading - hanya panggil API yang diperlukan
   * Menghindari duplikasi API call dan menggunakan caching untuk data yang tidak berubah
   */
  useEffect(() => {
    const currentYear = moment(startDate).format('YYYY')
    const today = moment().format('YYYY-MM-DD')
    const selectedDate = moment(startDate).format('YYYY-MM-DD')
    
    // Smart API loading based on cache state
    onAppear(startDate, finishDate, {
      needsLastData: !chartData.dataCache.lastLoaded,
      needsDailyData: !chartData.dataCache.dailyLoaded && selectedDate === today,
      needsMonthlyData: chartData.dataCache.monthlyYear !== currentYear,
      needsForecastData: !chartData.dataCache.forecastLoaded && selectedDate === today
    })
  }, [startDate, finishDate])

  // ===== EVENT HANDLERS =====
  const handleLogoutConfirm = () => {
    resetDataCache(setDataCache);
    hideConfirmModal();
    onLogoutPressed();
  };

  const handleModalStartDateToggle = () => {
    setModalStartDate(!modalStartDate);
  };

  const closeDateModal = () => {
    setModalStartDate(false);
  };

  const handleQuickFilterSelect = (newStartDate, newFinishDate) => {
    utilHandleQuickFilter(
      newStartDate, 
      newFinishDate,
      setStartDate,
      setFinishDate,
      onAppear
    );
  };

  // ===== RENDER METHODS =====
  const renderWaterDepthCards = () => (
    <WaterDepthCards 
      currentDepth={waterBenderLast}
      averageDepth={waterBenderAvg}
      selectedDate={startDate}
    />
  );

  /**
   * Render modern date selection section
   */
  const renderDateSelection = () => (
    <DateSelectionSection 
      selectedDate={startDate}
      isRefreshing={isRefreshing}
      isLandscape={isLandscape}
      onDatePickerPress={handleModalStartDateToggle}
      onQuickFilterSelect={handleQuickFilterSelect}
    />
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
          refreshControl={<RefreshControl {...refreshControlProps} />}
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
            {!isLoading && !isChartsLoading ? (
              <View>
                {/* Period Chart Section */}
                <PeriodChartSection 
                  chartData={generateChartWaterBenderPeriod}
                  isLoading={periodLoadingState}
                  startDate={startDate}
                  finishDate={finishDate}
                  style={{ marginTop: 20 }}
                />

                {/* Monthly Chart Section */}
                <MonthlyChartSection 
                  data={generateChartWaterBenderMonthly}
                  loading={monthlyLoadingState}
                  style={{ marginTop: 20 }}
                />

                {/* Daily/Hourly Chart Section */}
                <DailyHourlyChartSection 
                  data={generateChartWaterBenderDailyWithForecast}
                  loading={isChartsLoading || !generateChartWaterBenderDailyWithForecast || generateChartWaterBenderDailyWithForecast.length === 0}
                  isForecastLoading={isForecastLoading}
                  getDataPointLineColors={getDataPointLineColors}
                  style={{ marginTop: 20 }}
                />
              </View>
            ) : (
              /* Loading State for All Charts */
              <View>
                <PeriodChartSection 
                  chartData={[]}
                  isLoading={true}
                  startDate={startDate}
                  finishDate={finishDate}
                  style={{ marginTop: 20 }}
                />
                <MonthlyChartSection 
                  data={[]}
                  loading={true}
                  style={{ marginTop: 20 }}
                />
                <DailyHourlyChartSection 
                  data={[]}
                  loading={true}
                  isForecastLoading={false}
                  getDataPointLineColors={getDataPointLineColors}
                  style={{ marginTop: 20 }}
                />
              </View>
            )}

          </View>
        </ScrollView>
      </View>
      
      {/* Modal Components */}
      <MyModalConfirm
        isVisible={!!modalConfirm}
        closeModal={hideConfirmModal}
        onSubmit={handleLogoutConfirm}
        message={"Apakah anda yakin ingin log out ?"}
      />
      
      
      {/* Enhanced Date Selection Modal */}
      <MyModal 
        isVisible={modalStartDate} 
        closeModal={closeDateModal}
        headerActive={true}
        headerTitle="Select Date Range"
        headerColor={'transparent'}
      >
        <DatePicker
          value={startDate}
          onChangeDate={setStartDate}
          onChangeFinishDate={setFinishDate}
          closeDate={closeDateModal}
        />
      </MyModal>
      
      {/* Info Modal */}
      <MyModalInfo
        isVisible={showModalInfo}
        closeModal={hideInfoModal}
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
  
})