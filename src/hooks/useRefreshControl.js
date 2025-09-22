import { useState, useCallback } from 'react';

/**
 * useRefreshControl - Custom hook for managing pull-to-refresh functionality
 * 
 * @description This hook provides pull-to-refresh state management and handlers
 * for dashboard data refreshing functionality.
 * 
 * @param {Function} onRefresh - Callback function to execute when refresh is triggered
 * 
 * @returns {Object} Refresh control state and handlers
 * @returns {boolean} isRefreshing - Whether refresh is currently in progress
 * @returns {Function} handleRefresh - Function to trigger refresh manually
 * @returns {Function} setIsRefreshing - Function to set refresh state manually
 * @returns {Object} refreshControlProps - Props object to spread into RefreshControl component
 * 
 * @example
 * const {
 *   isRefreshing,
 *   handleRefresh,
 *   refreshControlProps
 * } = useRefreshControl(() => {
 *   // Refresh logic here
 *   reloadDashboardData();
 * });
 * 
 * // In ScrollView:
 * <ScrollView
 *   refreshControl={<RefreshControl {...refreshControlProps} />}
 * >
 *   {content}
 * </ScrollView>
 * 
 * @author Water Monitoring Dashboard Team
 * @version 1.0.0
 */
const useRefreshControl = (onRefresh) => {
  // ===== REFRESH STATE =====
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // ===== REFRESH HANDLER =====
  const handleRefresh = useCallback(async () => {
    console.log('🔄 Pull-to-refresh triggered');
    setIsRefreshing(true);
    
    try {
      if (onRefresh && typeof onRefresh === 'function') {
        await onRefresh();
      }
    } catch (error) {
      console.error('❌ Error during refresh:', error);
    } finally {
      setIsRefreshing(false);
      console.log('✅ Pull-to-refresh completed');
    }
  }, [onRefresh]);
  
  // ===== REFRESH CONTROL PROPS =====
  const refreshControlProps = {
    refreshing: isRefreshing,
    onRefresh: handleRefresh,
    colors: ['#dd5746'], // Android refresh indicator colors
    tintColor: '#dd5746', // iOS refresh indicator color
    title: 'Pull to refresh...', // iOS refresh text
    titleColor: '#666666', // iOS refresh text color
  };
  
  return {
    isRefreshing,
    handleRefresh,
    setIsRefreshing,
    refreshControlProps,
  };
};

export default useRefreshControl;