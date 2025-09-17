import { useState, useEffect } from 'react';
import moment from 'moment';
import { generateChartData, generateDailyChartWithForecast } from '../screens/dashboard/dataChart';

/**
 * useChartData - Custom hook for managing chart data processing and state
 * 
 * @description This hook handles chart data processing for different chart types
 * including Period, Monthly, and Daily/Hourly charts with forecast support.
 * 
 * @param {Object} props - Hook parameters
 * @param {Array} props.waterBenderAvgDistance - Average distance data
 * @param {Array} props.waterBenderLast - Last reading data
 * @param {Array} props.waterBenderAvg - Average data
 * @param {Array} props.waterBenderMonthly - Monthly data
 * @param {Array} props.waterBenderPeriod - Period data
 * @param {Array} props.waterBenderDaily - Daily data
 * @param {Array} props.waterBenderForecast - Forecast data
 * @param {Date} props.startDate - Start date for period chart
 * 
 * @returns {Object} Chart data and processing state
 * @returns {Array} generateChartWaterBenderAvgDistance - Processed average distance chart data
 * @returns {Array} generateChartWaterBenderPeriod - Processed period chart data
 * @returns {Array} generateChartWaterBenderMonthly - Processed monthly chart data
 * @returns {Array} generateChartWaterBenderDailyWithForecast - Processed daily/hourly chart data with forecast
 * @returns {boolean} isChartsLoading - Whether charts are loading/processing
 * @returns {Object} dataCache - Cache state for optimization
 * @returns {Function} setDataCache - Function to update cache state
 * 
 * @example
 * const {
 *   generateChartWaterBenderPeriod,
 *   generateChartWaterBenderMonthly,
 *   generateChartWaterBenderDailyWithForecast,
 *   isChartsLoading,
 *   dataCache,
 *   setDataCache
 * } = useChartData({
 *   waterBenderPeriod,
 *   waterBenderMonthly,
 *   waterBenderDaily,
 *   waterBenderForecast,
 *   startDate
 * });
 * 
 * @author Water Monitoring Dashboard Team
 * @version 1.0.0
 */
const useChartData = ({
  waterBenderAvgDistance,
  waterBenderLast,
  waterBenderAvg,
  waterBenderMonthly,
  waterBenderPeriod,
  waterBenderDaily,
  waterBenderForecast,
  startDate
}) => {
  // ===== CHART DATA STATE =====
  const [processedChartData, setProcessedChartData] = useState({
    avgDistance: [],
    period: [],
    monthly: [],
    dailyWithForecast: []
  });
  
  const [isChartsLoading, setIsChartsLoading] = useState(true);
  
  // ===== PERIOD CHART SPECIFIC LOADING STATE =====
  const [isPeriodLoading, setIsPeriodLoading] = useState(false);
  const [lastProcessedStartDate, setLastProcessedStartDate] = useState(null);
  
  // ===== API OPTIMIZATION STATE =====
  const [dataCache, setDataCache] = useState({
    lastLoaded: null,
    dailyLoaded: false,
    monthlyYear: null,
    forecastLoaded: false
  });
  
  // ===== DATE CHANGE DETECTION FOR PERIOD LOADING =====
  useEffect(() => {
    const currentStartDate = moment(startDate).format('YYYY-MM-DD');
    
    // Check if date has changed
    if (lastProcessedStartDate && lastProcessedStartDate !== currentStartDate) {
      console.log('📅 Date change detected for period chart:', {
        previousDate: lastProcessedStartDate,
        newDate: currentStartDate
      });
      console.log('🔄 Setting period loading to TRUE due to date change');
      setIsPeriodLoading(true);
    }
    
    setLastProcessedStartDate(currentStartDate);
  }, [startDate, lastProcessedStartDate]);
  
  // ===== PERIOD DATA AVAILABILITY CHECK =====
  useEffect(() => {
    // If we have period data and period is currently loading, stop loading
    if (waterBenderPeriod && waterBenderPeriod.length > 0 && isPeriodLoading) {
      console.log('📊 Period data available, but still need to process it');
    }
  }, [waterBenderPeriod, isPeriodLoading]);

  
  // ===== CHART DATA PROCESSING EFFECT =====
  useEffect(() => {
    const processChartData = () => {
      console.log('📊 Processing chart data...');
      console.log('🔍 Data availability check:', {
        avgDistance: !!waterBenderAvgDistance,
        last: !!waterBenderLast,
        avg: !!waterBenderAvg,
        monthly: !!waterBenderMonthly,
        period: !!waterBenderPeriod,
        daily: !!waterBenderDaily,
        forecast: !!waterBenderForecast
      });
      
      setIsChartsLoading(true);
      
      try {
        const newProcessedData = { ...processedChartData };
        
        // Process charts independently to avoid blocking
        if (waterBenderAvgDistance && waterBenderLast && waterBenderAvg) {
          console.log('✅ Processing avgDistance chart data');
          newProcessedData.avgDistance = generateChartData(waterBenderAvgDistance, 1);
        }
        
        if (waterBenderPeriod) {
          console.log('✅ Processing period chart data');
          console.log('📊 Period raw data:', {
            length: waterBenderPeriod.length,
            sample: waterBenderPeriod.slice(0, 2),
            startDate: moment(startDate).format('YYYY-MM-DD')
          });
          newProcessedData.period = generateChartData(waterBenderPeriod, 2);
          console.log('📈 Period processed data:', {
            length: newProcessedData.period?.length || 0,
            sample: newProcessedData.period?.slice(0, 2) || []
          });
          console.log('✅ Period processing completed, setting period loading to FALSE');
          setIsPeriodLoading(false);
        } else {
          console.log('❌ Period data not available, keeping period loading state TRUE');
          // Keep period loading if we're expecting data due to date change
          if (!isPeriodLoading && lastProcessedStartDate) {
            setIsPeriodLoading(true);
          }
        }
        
        if (waterBenderMonthly) {
          console.log('✅ Processing monthly chart data');
          console.log('📊 Monthly raw data:', {
            length: waterBenderMonthly.length,
            sample: waterBenderMonthly.slice(0, 2),
            isArray: Array.isArray(waterBenderMonthly)
          });
          newProcessedData.monthly = generateChartData(waterBenderMonthly, 3);
          console.log('📈 Monthly processed data:', {
            length: newProcessedData.monthly?.length || 0,
            sample: newProcessedData.monthly?.slice(0, 2) || []
          });
        } else {
          console.log('❌ Monthly data not available:', {
            waterBenderMonthly,
            type: typeof waterBenderMonthly,
            isNull: waterBenderMonthly === null,
            isUndefined: waterBenderMonthly === undefined
          });
        }
        
        // Process daily chart with forecast optimization
        if (waterBenderDaily) {
          console.log('📈 Processing daily/hourly chart data...');
          
          if (waterBenderForecast && waterBenderForecast.length > 0) {
            console.log('🔮 Generating combined chart with forecast data');
            newProcessedData.dailyWithForecast = generateDailyChartWithForecast(waterBenderDaily, waterBenderForecast);
          } else {
            console.log('📊 Generating chart with actual data only');
            newProcessedData.dailyWithForecast = generateChartData(waterBenderDaily, 1);
          }
          
          console.log('✅ Daily chart processing completed:', {
            totalPoints: newProcessedData.dailyWithForecast.length,
            actualPoints: newProcessedData.dailyWithForecast.filter(d => d.isActual).length,
            forecastPoints: newProcessedData.dailyWithForecast.filter(d => d.isForecast).length
          });
        }
        
        setProcessedChartData(newProcessedData);
        
        // Log final processing results
        console.log('🎯 Chart processing completed:', {
          avgDistanceLength: newProcessedData.avgDistance?.length || 0,
          periodLength: newProcessedData.period?.length || 0,
          monthlyLength: newProcessedData.monthly?.length || 0,
          dailyLength: newProcessedData.dailyWithForecast?.length || 0
        });
        
        // Set loading false immediately if we have any processed data
        const hasAnyData = newProcessedData.avgDistance?.length > 0 || 
                          newProcessedData.period?.length > 0 || 
                          newProcessedData.monthly?.length > 0 || 
                          newProcessedData.dailyWithForecast?.length > 0;
        
        console.log('⚡ Setting charts loading state:', {
          hasAnyData,
          settingLoadingTo: !hasAnyData
        });
        
        setIsChartsLoading(!hasAnyData);
        
      } catch (error) {
        console.error('❌ Error processing chart data:', error);
        setIsChartsLoading(false);
      }
    };
    
    processChartData();
  }, [
    waterBenderAvgDistance,
    waterBenderLast,
    waterBenderAvg,
    waterBenderMonthly,
    waterBenderPeriod,
    waterBenderDaily,
    waterBenderForecast,
    startDate
  ]);
  
  // ===== CACHE OPTIMIZATION EFFECT =====
  useEffect(() => {
    const currentYear = moment(startDate).format('YYYY');
    const today = moment().format('YYYY-MM-DD');
    const selectedDate = moment(startDate).format('YYYY-MM-DD');
    
    // Update cache state based on data availability
    if (waterBenderDaily) {
      setDataCache(prev => ({
        ...prev,
        lastLoaded: selectedDate,
        dailyLoaded: true
      }));
    }
    
    if (waterBenderMonthly) {
      setDataCache(prev => ({
        ...prev,
        monthlyYear: currentYear
      }));
    }
    
    if (waterBenderForecast) {
      setDataCache(prev => ({
        ...prev,
        forecastLoaded: true
      }));
    }
  }, [waterBenderDaily, waterBenderMonthly, waterBenderForecast, startDate]);
  
  return {
    // Processed chart data
    generateChartWaterBenderAvgDistance: processedChartData.avgDistance,
    generateChartWaterBenderPeriod: processedChartData.period,
    generateChartWaterBenderMonthly: processedChartData.monthly,
    generateChartWaterBenderDailyWithForecast: processedChartData.dailyWithForecast,
    
    // Loading state
    isChartsLoading,
    isPeriodLoading,
    
    // Cache state
    dataCache,
    setDataCache,
  };
};

export default useChartData;