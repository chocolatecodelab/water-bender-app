/**
 * Redux Connection Layer for Login Screen
 * 
 * This file serves as the bridge between the Login component and Redux store,
 * managing authentication state, form data, and navigation flow for user login.
 * 
 * Features:
 * - User authentication state management
 * - Form input validation and error handling  
 * - Secure login flow with comprehensive validation
 * - Navigation management with proper state cleanup
 * - Enhanced debugging and error logging
 * 
 * Security Features:
 * - Input validation and sanitization
 * - Secure password handling
 * - Authentication state validation
 * - Auto-navigation with state cleanup
 * 
 * @file src/screens/login/ReduxConnect.js
 * @version 1.0.0
 * @author Water Monitoring Team
 */

// ===== CORE REDUX IMPORTS =====
import { connect } from 'react-redux';

// ===== REDUX FEATURE IMPORTS =====
import { 
  resetAuth, 
  resetLogin, 
  setUsername, 
  setPassword, 
  uploadLoginAsync 
} from '../../redux/features/login/loginSlice';

// ===== NAVIGATION IMPORTS =====
import { 
  NAV_NAME_DASHBOARD, 
  NAV_NAME_REGISTER 
} from '../../tools/constant';
import NavigationService from '../../tools/navigationService';

// ===== COMPONENT IMPORTS =====
import LoginScreen from './Login';

// ===== STATE TO PROPS MAPPING =====

/**
 * Maps Redux state to component props
 * 
 * Provides Login component with authentication state, form data,
 * and loading/error states for comprehensive user experience.
 * 
 * Features:
 * - Authentication state monitoring
 * - Form data binding (username, password)
 * - Loading and error state management
 * - Debug logging for development
 * 
 * @param {Object} state - Redux store state
 * @returns {Object} Props object for Login component
 */
const mapStateToProps = state => {
    // ===== DEBUG LOGGING =====
    console.log('🔍 Login Screen State:', {
        username: state.auth?.username,
        isError: state.auth?.isError,
        isSuccess: state.auth?.isSuccess,
        isLoading: state.auth?.isLoading,
        hasUser: !!state.auth?.user,
        message: state.auth?.message,
    });
    
    return ({
        // ===== FORM DATA STATE =====
        username: state.auth.username,
        password: state.auth.password,
        
        // ===== AUTHENTICATION STATUS =====
        isError: state.auth.isError,
        isSuccess: state.auth.isSuccess,
        isLoading: state.auth.isLoading,
        message: state.auth.message,
    });
};

// ===== DISPATCH TO PROPS MAPPING =====

/**
 * Maps Redux actions to component props
 * 
 * Provides Login component with action dispatchers for form handling,
 * validation, authentication, and navigation management.
 * 
 * Features:
 * - Form state management (username, password)
 * - Comprehensive input validation
 * - Secure authentication handling
 * - Navigation with proper state cleanup
 * - Enhanced error handling and logging
 * 
 * @param {Function} dispatch - Redux dispatch function
 * @returns {Object} Action dispatchers object for Login component
 */
const mapDispatchToProps = (dispatch) => ({
    /**
     * Initialize login screen
     * 
     * Resets all form and authentication states when component mounts.
     * Ensures clean slate for new login attempt.
     */
    onAppear: () => {
        console.log('🔄 Initializing login screen - resetting states');
        dispatch(resetLogin());
        dispatch(resetAuth());
    },
    
    /**
     * Handle username input change
     * 
     * Updates username in Redux store as user types.
     * 
     * @param {string} username - New username value
     */
    onChangeUsername: (username) => {
        dispatch(setUsername(username));
    },
    
    /**
     * Handle password input change
     * 
     * Updates password in Redux store as user types.
     * 
     * @param {string} password - New password value
     */
    onChangePassword: (password) => {
        dispatch(setPassword(password));
    },
    
    /**
     * Handle login form submission
     * 
     * Performs comprehensive validation before dispatching login action.
     * Validates both username and password with specific requirements.
     * 
     * Validation Rules:
     * - Username: Required, minimum 3 characters
     * - Password: Required, minimum 6 characters
     * 
     * @param {string} username - Username input value
     * @param {string} password - Password input value
     * @param {Function} setErrorPassword - Password error setter function
     * @param {Function} setErrorUsername - Username error setter function
     */
    onSubmitPressed: (username, password, setErrorPassword, setErrorUsername) => {
        console.log('🔐 Login attempt initiated');
        
        // ===== CLEAR PREVIOUS ERRORS =====
        setErrorUsername(null);
        setErrorPassword(null);
        
        // ===== INPUT VALIDATION =====
        let hasError = false;
        
        // Username validation
        if (!username || username.trim() === '') {
            setErrorUsername('Username is required');
            hasError = true;
            console.log('❌ Username validation failed: empty');
        } else if (username.trim().length < 3) {
            setErrorUsername('Username must be at least 3 characters');
            hasError = true;
            console.log('❌ Username validation failed: too short');
        }
        
        // Password validation
        if (!password || password === '') {
            setErrorPassword('Password is required');
            hasError = true;
            console.log('❌ Password validation failed: empty');
        } else if (password.length < 6) {
            setErrorPassword('Password must be at least 6 characters');
            hasError = true;
            console.log('❌ Password validation failed: too short');
        }
        
        // ===== AUTHENTICATION REQUEST =====
        if (!hasError) {
            const loginData = {
                username: username.trim(),
                password: password
            };
            
            console.log('✅ Validation passed, sending login request:', { 
                username: loginData.username, 
                hasPassword: !!loginData.password 
            });
            
            dispatch(uploadLoginAsync(loginData));
        } else {
            console.log('❌ Login validation failed, not proceeding');
        }
    },
    
    /**
     * Handle successful login navigation
     * 
     * Navigates to dashboard after successful authentication.
     * Includes state cleanup and delayed navigation for smooth UX.
     */
    onNavigationDashboard: () => {
        console.log('🎯 Login successful, preparing dashboard navigation...');
        
        // Clear only UI states, preserve authentication data
        dispatch(resetAuth()); // Only clears isSuccess/isError flags, keeps user data
        
        // Use setTimeout to ensure state updates are processed
        setTimeout(() => {
            console.log('🚀 Executing navigation to Dashboard');
            NavigationService.replace(NAV_NAME_DASHBOARD);
        }, 150);
    },
    
    /**
     * Handle navigation to registration screen
     * 
     * Navigates to registration with state cleanup.
     */
    onNavigationRegister: () => {
        console.log('📝 Navigating to registration screen');
        dispatch(resetLogin());
        dispatch(resetAuth());
        NavigationService.navigate(NAV_NAME_REGISTER);
    },
    
    /**
     * Handle navigation to forgot password screen
     * 
     * Placeholder for forgot password functionality.
     * Currently logs action but doesn't navigate.
     */
    onNavigationForgetPassword: () => {
        console.log('🔑 Forgot password requested (not implemented)');
        // TODO: Implement forgot password navigation
        // NavigationService.navigate(NAV_NAME_FORGET_PASSWORD);
    },
    
    /**
     * Handle error modal close
     * 
     * Resets authentication error states when user closes error modal.
     */
    onCloseModalError: () => {
        console.log('❌ Error modal closed, resetting error state');
        dispatch(resetAuth());
    },
});

// ===== REDUX CONNECTION =====

/**
 * Connect Login component to Redux store
 * 
 * Creates a Higher-Order Component (HOC) that connects the Login
 * component to the Redux store, providing it with authentication state
 * and action dispatchers.
 * 
 * Benefits:
 * - Automatic re-rendering when authentication state changes
 * - Clean separation of concerns (UI vs State Management)
 * - Optimized performance with shallow equality checks
 * - Type-safe prop injection
 * - Centralized state management for authentication flow
 * 
 * @returns {React.ComponentType} Connected Login component
 */
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
