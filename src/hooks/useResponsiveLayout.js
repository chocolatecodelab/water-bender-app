import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

/**
 * useResponsiveLayout - Custom hook for managing responsive layout detection
 * 
 * @description This hook manages screen dimension changes and provides responsive
 * layout utilities for handling orientation changes and different screen sizes.
 * 
 * @returns {Object} Responsive layout state and utilities
 * @returns {Object} screenDimensions - Current screen dimensions {width, height}
 * @returns {boolean} isLandscape - Whether device is in landscape mode
 * @returns {boolean} isTablet - Whether device is a tablet (width > 768)
 * @returns {boolean} isSmallScreen - Whether device has a small screen (width < 400)
 * @returns {string} screenSize - Screen size category ('small', 'medium', 'large', 'xlarge')
 * 
 * @example
 * const {
 *   screenDimensions,
 *   isLandscape,
 *   isTablet,
 *   isSmallScreen,
 *   screenSize
 * } = useResponsiveLayout();
 * 
 * @author Water Monitoring Dashboard Team
 * @version 1.0.0
 */
const useResponsiveLayout = () => {
  // ===== RESPONSIVE STATE =====
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  
  // ===== COMPUTED VALUES =====
  const isLandscape = screenDimensions.width > screenDimensions.height;
  const isTablet = screenDimensions.width > 768;
  const isSmallScreen = screenDimensions.width < 400;
  
  // Screen size categories
  const getScreenSize = (width) => {
    if (width < 400) return 'small';
    if (width < 768) return 'medium';  
    if (width < 1024) return 'large';
    return 'xlarge';
  };
  
  const screenSize = getScreenSize(screenDimensions.width);
  
  // ===== DIMENSION CHANGE LISTENER =====
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });
    
    return () => subscription?.remove();
  }, []);
  
  return {
    screenDimensions,
    isLandscape,
    isTablet,
    isSmallScreen,
    screenSize,
  };
};

export default useResponsiveLayout;