/**
 * Splash Screen Redux Connection Layer
 * 
 * Redux container component that handles authentication state management
 * and navigation logic for the splash screen. Determines whether user
 * should be directed to dashboard or login based on authentication status.
 * 
 * Features:
 * - Authentication state validation using proper selectors
 * - Automatic navigation based on user session persistence
 * - Comprehensive logging for debugging and monitoring
 * - Proper error handling and fallback navigation
 * - Clean separation of state management and UI components
 * 
 * Authentication Logic:
 * - Checks for valid user session data and authentication status
 * - Redirects authenticated users directly to dashboard
 * - Redirects unauthenticated users to login screen
 * - Handles edge cases like corrupted or partial session data
 * 
 * @file src/screens/splash/ReduxConnext.js
 * @version 1.0.0
 */

import { connect } from "react-redux";
import SplashScreen from "./Splash";
import NavigationService from "../../tools/navigationService";
import { 
    NAV_NAME_DASHBOARD, 
    NAV_NAME_HOME, 
    NAV_NAME_LOGIN 
} from "../../tools/constant";
import { 
    selectIsAuthenticated, 
    selectCurrentUser 
} from "../../redux/features/login/loginSlice";

// ===== AUTHENTICATION STATE MAPPING =====

/**
 * Map Redux authentication state to component props
 * 
 * Uses proper selectors to determine authentication status and provides
 * comprehensive debugging information for development and troubleshooting.
 * 
 * @param {Object} state - Redux root state
 * @returns {Object} Mapped props for splash screen component
 */
const mapStateToProps = (state) => {
    // Get authentication status using proper selectors
    const isAuthenticated = selectIsAuthenticated(state);
    const currentUser = selectCurrentUser(state);
    
    // Comprehensive logging for debugging authentication flow
    console.log('🔍 Splash Screen Authentication Check:', {
        isAuthenticated,
        hasUser: !!currentUser,
        username: state.auth?.username || 'none',
        isSuccess: state.auth?.isSuccess || false,
        isError: state.auth?.isError || false,
        userData: currentUser ? 'present' : 'missing',
        sessionInfo: {
            username: state.auth?.username,
            isSuccess: state.auth?.isSuccess,
            isError: state.auth?.isError,
            hasUserData: !!state.auth?.user,
            lastLoginAttempt: state.auth?.lastLoginAttempt || 'never'
        }
    });
    
    return {
        // Core authentication props
        isAuthenticated,
        currentUser,
        username: state.auth?.username || '',
        
        // Combined validation for cleaner component logic
        hasValidSession: isAuthenticated && currentUser,
        
        // Development and debugging props
        debugAuthState: __DEV__ ? state.auth : undefined,
        
        // Additional session information for component logic
        sessionTimestamp: state.auth?.lastLoginAttempt
    };
};

// ===== NAVIGATION LOGIC =====

/**
 * Map dispatch actions to component props
 * 
 * Handles proper navigation routing based on authentication status
 * with comprehensive logging and error handling.
 * 
 * @returns {Object} Mapped dispatch actions for component
 */
const mapDispatchToProps = () => ({
    /**
     * Handle splash screen appearance and navigation routing
     * 
     * Determines the appropriate navigation destination based on user
     * authentication status and session validity.
     * 
     * @param {boolean} isAuthenticated - Whether user is authenticated
     * @param {Object|null} currentUser - Current user data object
     * @param {boolean} hasValidSession - Combined authentication check
     */
    onAppear: (isAuthenticated, currentUser, hasValidSession) => {
        const navigationDecision = {
            isAuthenticated,
            hasUserData: !!currentUser,
            hasValidSession,
            timestamp: new Date().toISOString()
        };
        
        console.log('🚀 Splash Navigation Decision:', navigationDecision);
        
        try {
            // Determine navigation destination based on authentication status
            if (isAuthenticated && currentUser) {
                console.log('✅ Valid authentication session found');
                console.log('📱 Navigating to Dashboard - User authenticated');
                
                // Navigate to dashboard for authenticated users
                return NavigationService.replace(NAV_NAME_DASHBOARD);
                
            } else {
                // Handle unauthenticated users or invalid sessions
                const reason = !isAuthenticated 
                    ? 'User not authenticated' 
                    : 'Missing user data';
                    
                console.log(`❌ Authentication failed: ${reason}`);
                console.log('🔐 Navigating to Login - Authentication required');
                
                // Navigate to login for unauthenticated users
                return NavigationService.replace(NAV_NAME_LOGIN);
            }
        } catch (navigationError) {
            // Handle navigation errors gracefully
            console.error('🚨 Navigation Error in Splash Screen:', navigationError);
            
            // Fallback navigation to login on error
            console.log('🔄 Fallback navigation to Login due to error');
            return NavigationService.replace(NAV_NAME_LOGIN);
        }
    },
    
    /**
     * Handle splash screen timeout or fallback scenarios
     * 
     * Provides fallback navigation if authentication check takes too long
     * or encounters unexpected states.
     */
    onTimeout: () => {
        console.log('⏰ Splash screen timeout - defaulting to Login');
        return NavigationService.replace(NAV_NAME_LOGIN);
    }
});

// ===== COMPONENT EXPORT =====

/**
 * Export Redux-connected splash screen component
 * 
 * Combines the splash screen UI component with Redux state management
 * and navigation logic for a complete authentication-aware splash screen.
 */
export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);