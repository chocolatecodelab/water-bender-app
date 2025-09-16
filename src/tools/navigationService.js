/**
 * Navigation Service
 * 
 * Centralized navigation service for React Navigation management.
 * Provides programmatic navigation capabilities outside of React components
 * with comprehensive error handling and navigation state management.
 * 
 * Features:
 * - Programmatic navigation from any part of the app
 * - Navigation readiness checks to prevent crashes
 * - Support for all common navigation actions
 * - Error handling and fallback mechanisms
 * - Stack manipulation utilities
 * - Navigation state reset functionality
 * 
 * Usage:
 * - Use in Redux actions, API callbacks, or utility functions
 * - Always checks navigation readiness before executing
 * - Provides consistent navigation experience across the app
 * 
 * @file src/tools/navigationService.js
 * @version 1.0.0
 */

import { 
  CommonActions, 
  createNavigationContainerRef, 
  StackActions 
} from '@react-navigation/native';

// ===== NAVIGATION REFERENCE =====

/**
 * Navigation container reference
 * 
 * Creates a ref that can be used to control navigation from outside
 * of React components. This is essential for navigation triggered
 * by Redux actions, API responses, or other non-component code.
 */
const navigationRef = createNavigationContainerRef();

// ===== CORE NAVIGATION FUNCTIONS =====

/**
 * Navigate to a specific route
 * 
 * Programmatically navigates to a specified route with optional parameters.
 * Includes safety checks to ensure navigation is ready before attempting
 * to navigate, preventing crashes during app initialization.
 * 
 * @param {string} routeName - The name of the route to navigate to
 * @param {Object} [params={}] - Optional parameters to pass to the route
 * @returns {boolean} True if navigation was successful, false otherwise
 * 
 * @example
 * // Basic navigation
 * NavigationService.navigate('Dashboard');
 * 
 * // Navigation with parameters
 * NavigationService.navigate('Profile', { userId: 123 });
 * 
 * // In Redux action
 * if (NavigationService.navigate('Login')) {
 *   console.log('Navigation successful');
 * }
 */
function navigate(routeName, params = {}) {
  try {
    // Safety check: ensure navigation container is ready
    if (navigationRef.isReady()) {
      navigationRef.navigate(routeName, params);
      console.log(`🧭 Navigation: ${routeName}`, params ? { params } : '');
      return true;
    } else {
      console.warn('⚠️ Navigation attempted before container ready:', routeName);
      return false;
    }
  } catch (error) {
    console.error('❌ Navigation error:', {
      routeName,
      params,
      error: error.message
    });
    return false;
  }
}

/**
 * Navigate back to previous screen
 * 
 * Triggers the back navigation action, returning to the previous screen
 * in the navigation stack. Includes safety checks and error handling.
 * 
 * @returns {boolean} True if back navigation was successful, false otherwise
 * 
 * @example
 * // Simple back navigation
 * NavigationService.back();
 * 
 * // With success check
 * if (!NavigationService.back()) {
 *   // Handle case where back navigation failed
 *   NavigationService.navigate('Dashboard');
 * }
 */
function back() {
  try {
    if (navigationRef.isReady()) {
      // Check if we can go back (not at root screen)
      if (navigationRef.canGoBack()) {
        navigationRef.goBack();
        console.log('🔙 Navigation: Back');
        return true;
      } else {
        console.warn('⚠️ Cannot go back: Already at root screen');
        return false;
      }
    } else {
      console.warn('⚠️ Back navigation attempted before container ready');
      return false;
    }
  } catch (error) {
    console.error('❌ Back navigation error:', error.message);
    return false;
  }
}

/**
 * Replace current screen with new screen
 * 
 * Replaces the current screen with a new one, preventing the user
 * from navigating back to the replaced screen. Useful for login flows
 * and screen transitions where back navigation should be prevented.
 * 
 * @param {...any} args - Arguments to pass to StackActions.replace()
 * @returns {boolean} True if replacement was successful, false otherwise
 * 
 * @example
 * // Replace login screen with dashboard after successful login
 * NavigationService.replace('Dashboard');
 * 
 * // Replace with parameters
 * NavigationService.replace('Welcome', { isFirstTime: true });
 */
function replace(...args) {
  try {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.replace(...args));
      console.log('🔄 Navigation: Replace ->', args[0]);
      return true;
    } else {
      console.warn('⚠️ Replace navigation attempted before container ready');
      return false;
    }
  } catch (error) {
    console.error('❌ Replace navigation error:', {
      args,
      error: error.message
    });
    return false;
  }
}

/**
 * Pop to top of navigation stack
 * 
 * Navigates back to the root screen of the current stack,
 * removing all screens in between. Useful for "Home" buttons
 * or resetting navigation state.
 * 
 * @param {...any} args - Additional arguments for StackActions.popToTop()
 * @returns {boolean} True if pop to top was successful, false otherwise
 * 
 * @example
 * // Return to root screen
 * NavigationService.popToTop();
 * 
 * // After deep navigation, return to start
 * NavigationService.popToTop();
 */
function popToTop(...args) {
  try {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.popToTop(...args));
      console.log('🏠 Navigation: Pop to top');
      return true;
    } else {
      console.warn('⚠️ PopToTop navigation attempted before container ready');
      return false;
    }
  } catch (error) {
    console.error('❌ PopToTop navigation error:', {
      args,
      error: error.message
    });
    return false;
  }
}

/**
 * Reset navigation state to specific route
 * 
 * Completely resets the navigation state to show only the specified route,
 * clearing the entire navigation history. This is useful for logout flows,
 * onboarding completion, or major app state changes.
 * 
 * @param {string} routeName - The route name to reset to
 * @param {Object} [params={}] - Optional parameters for the target route
 * @returns {boolean} True if reset was successful, false otherwise
 * 
 * @example
 * // Reset to login screen (logout)
 * NavigationService.reset('Login');
 * 
 * // Reset to dashboard with parameters
 * NavigationService.reset('Dashboard', { welcomeMessage: 'Hello!' });
 * 
 * // Common logout flow
 * await logoutUser();
 * NavigationService.reset('Login');
 */
function reset(routeName, params = {}) {
  try {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: routeName,
              params: params
            }
          ]
        })
      );
      console.log(`🔄 Navigation: Reset to ${routeName}`, params ? { params } : '');
      return true;
    } else {
      console.warn('⚠️ Reset navigation attempted before container ready:', routeName);
      return false;
    }
  } catch (error) {
    console.error('❌ Reset navigation error:', {
      routeName,
      params,
      error: error.message
    });
    return false;
  }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Check if navigation container is ready
 * 
 * Utility function to check navigation readiness from external code.
 * Useful for conditional navigation logic.
 * 
 * @returns {boolean} True if navigation is ready, false otherwise
 * 
 * @example
 * if (NavigationService.isReady()) {
 *   NavigationService.navigate('Dashboard');
 * } else {
 *   console.log('Waiting for navigation...');
 * }
 */
function isReady() {
  return navigationRef.isReady();
}

/**
 * Check if back navigation is possible
 * 
 * Determines if the user can navigate back from the current screen.
 * Useful for showing/hiding back buttons or implementing custom back logic.
 * 
 * @returns {boolean} True if back navigation is possible, false otherwise
 * 
 * @example
 * const canGoBack = NavigationService.canGoBack();
 * if (canGoBack) {
 *   // Show back button
 * } else {
 *   // Show home button or hide navigation
 * }
 */
function canGoBack() {
  try {
    return navigationRef.isReady() && navigationRef.canGoBack();
  } catch (error) {
    console.error('❌ Error checking canGoBack:', error.message);
    return false;
  }
}

/**
 * Get current route name
 * 
 * Returns the name of the currently active route.
 * Useful for analytics, conditional logic, or debugging.
 * 
 * @returns {string|null} Current route name or null if unavailable
 * 
 * @example
 * const currentRoute = NavigationService.getCurrentRouteName();
 * if (currentRoute === 'Dashboard') {
 *   // Perform dashboard-specific logic
 * }
 */
function getCurrentRouteName() {
  try {
    if (navigationRef.isReady()) {
      return navigationRef.getCurrentRoute()?.name || null;
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting current route name:', error.message);
    return null;
  }
}

/**
 * Get navigation state
 * 
 * Returns the current navigation state object.
 * Useful for debugging or advanced navigation logic.
 * 
 * @returns {Object|null} Navigation state object or null if unavailable
 * 
 * @example
 * const navState = NavigationService.getNavigationState();
 * console.log('Current navigation stack:', navState?.routes);
 */
function getNavigationState() {
  try {
    if (navigationRef.isReady()) {
      return navigationRef.getState();
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting navigation state:', error.message);
    return null;
  }
}

// ===== ADVANCED NAVIGATION UTILITIES =====

/**
 * Navigate with replacement strategy
 * 
 * Intelligently chooses between navigate and replace based on the context.
 * Useful for login/logout flows where you want to prevent back navigation
 * to certain screens.
 * 
 * @param {string} routeName - Target route name
 * @param {Object} [params={}] - Route parameters
 * @param {boolean} [shouldReplace=false] - Whether to replace instead of navigate
 * @returns {boolean} True if navigation was successful
 * 
 * @example
 * // Navigate normally
 * NavigationService.navigateWithStrategy('Profile');
 * 
 * // Replace current screen (prevent back navigation)
 * NavigationService.navigateWithStrategy('Dashboard', {}, true);
 */
function navigateWithStrategy(routeName, params = {}, shouldReplace = false) {
  if (shouldReplace) {
    return replace(routeName, params);
  } else {
    return navigate(routeName, params);
  }
}

/**
 * Safe navigation with fallback
 * 
 * Attempts navigation with a fallback route if the primary route fails.
 * Useful for error recovery and ensuring users don't get stuck.
 * 
 * @param {string} primaryRoute - Primary route to navigate to
 * @param {string} fallbackRoute - Fallback route if primary fails
 * @param {Object} [params={}] - Parameters for primary route
 * @returns {boolean} True if any navigation was successful
 * 
 * @example
 * // Try to go to specific profile, fallback to profile list
 * NavigationService.safeNavigate('ProfileDetail', 'ProfileList', { userId: 123 });
 */
function safeNavigate(primaryRoute, fallbackRoute, params = {}) {
  const primarySuccess = navigate(primaryRoute, params);
  
  if (!primarySuccess && fallbackRoute) {
    console.log(`🔄 Primary navigation failed, trying fallback: ${fallbackRoute}`);
    return navigate(fallbackRoute);
  }
  
  return primarySuccess;
}

// ===== EXPORT CONFIGURATION =====

/**
 * Navigation Service Export
 * 
 * Exports all navigation functions and utilities as a single service object.
 * This provides a clean, consistent API for navigation throughout the app.
 */
const NavigationService = {
  // Core navigation functions
  navigate,
  back,
  replace,
  popToTop,
  reset,
  
  // Utility functions
  isReady,
  canGoBack,
  getCurrentRouteName,
  getNavigationState,
  
  // Advanced utilities
  navigateWithStrategy,
  safeNavigate,
  
  // Navigation reference (for NavigationContainer)
  navigationRef
};

export default NavigationService;

/**
 * Named exports for specific functions
 * Allows for selective imports if preferred
 */
export {
  navigate,
  back,
  replace,
  popToTop,
  reset,
  isReady,
  canGoBack,
  getCurrentRouteName,
  getNavigationState,
  navigateWithStrategy,
  safeNavigate,
  navigationRef
};
