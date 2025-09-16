/**
 * Login/Authentication Redux Slice
 * 
 * Redux Toolkit slice for managing user authentication state.
 * Handles login form data, authentication process, and user session state.
 * 
 * Features:
 * - User credentials management (username/password)
 * - Authentication request handling
 * - Loading, error, and success states
 * - Session management actions
 * - Form validation state
 * - Secure logout functionality
 * 
 * State Structure:
 * - username: Current username input
 * - password: Current password input (not persisted)
 * - isError: Authentication error flag
 * - isSuccess: Authentication success flag
 * - isLoading: Request in progress flag
 * - message: Status/error messages
 * - user: Authenticated user data
 * - lastLoginAttempt: Timestamp of last login attempt
 * 
 * @file src/redux/features/login/loginSlice.js
 * @version 1.0.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadLogin } from './loginService';

// ===== UTILITIES =====

/**
 * Extract error message from various error formats
 * Provides consistent error message extraction across different error types
 * 
 * @param {Error|Object} error - Error object from API or network
 * @returns {string} Human-readable error message
 */
const extractErrorMessage = (error) => {
    // Handle structured API error responses
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    
    // Handle standard error objects
    if (error?.message) {
        return error.message;
    }
    
    // Handle string errors
    if (typeof error === 'string') {
        return error;
    }
    
    // Handle serialized error responses
    if (error?.response && typeof error.response === 'string') {
        try {
            const parsedError = JSON.parse(error.response);
            return parsedError?.data?.message || parsedError?.message || 'Authentication failed';
        } catch (parseError) {
            return 'Authentication failed';
        }
    }
    
    // Default fallback message
    return 'An unexpected authentication error occurred';
};

/**
 * Validate login credentials
 * Basic client-side validation before sending request
 * 
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.username - Username
 * @param {string} credentials.password - Password
 * @returns {Object} Validation result
 */
const validateCredentials = (credentials) => {
    const errors = {};
    
    if (!credentials?.username?.trim()) {
        errors.username = 'Username is required';
    } else if (credentials.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
    }
    
    if (!credentials?.password) {
        errors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// ===== ASYNC THUNKS =====

/**
 * Upload Login Async Thunk
 * 
 * Handles user authentication with comprehensive error handling
 * and credential validation.
 * 
 * @async
 * @function uploadLoginAsync
 * @param {Object} data - Login credentials
 * @param {string} data.username - User's username
 * @param {string} data.password - User's password
 * @param {Object} thunkAPI - Redux Toolkit thunk API
 * @returns {Promise<Object>} Authentication result or rejection
 * 
 * @example
 * dispatch(uploadLoginAsync({
 *   username: 'john_doe',
 *   password: 'securePassword123'
 * }));
 */
export const uploadLoginAsync = createAsyncThunk(
    'auth/uploadLogin',
    async (data, thunkAPI) => {
        try {
            // Validate credentials before sending request
            const validation = validateCredentials(data);
            if (!validation.isValid) {
                const errorMessage = Object.values(validation.errors).join(', ');
                return thunkAPI.rejectWithValue(errorMessage);
            }

            console.log('🔄 Starting authentication process...', {
                username: data.username,
                timestamp: new Date().toISOString(),
                attempt: Date.now()
            });

            // Attempt login through service layer
            const result = await uploadLogin(data);

            console.log('✅ Authentication successful:', {
                username: data.username,
                hasUserData: !!result?.User,
                timestamp: new Date().toISOString()
            });

            return {
                ...result,
                loginTimestamp: new Date().toISOString(),
                username: data.username // Include username in response
            };

        } catch (error) {
            console.error('❌ Authentication failed:', {
                username: data?.username,
                error: error.message,
                status: error.response?.status,
                timestamp: new Date().toISOString()
            });

            const errorMessage = extractErrorMessage(error);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

// ===== INITIAL STATE =====

/**
 * Initial authentication state
 * Defines the default state structure for authentication
 */
const initialAuthState = {
    // Form credentials
    username: '',
    password: '',
    
    // Request state flags
    isError: false,
    isSuccess: false,
    isLoading: false,
    
    // User session data
    user: null,
    message: '',
    
    // Metadata
    lastLoginAttempt: null,
    validationErrors: {}
};

// ===== SLICE DEFINITION =====

/**
 * Authentication Redux Slice
 * 
 * Manages authentication state and provides actions for:
 * - Form field updates
 * - Authentication state management  
 * - Session management
 * - Error handling
 */
export const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        /**
         * Reset authentication error and success states
         * Keeps user session data but clears UI states
         * 
         * @param {Object} state - Current authentication state
         */
        resetAuth: (state) => {
            console.log('🔄 resetAuth called - clearing error/success flags');
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
            state.validationErrors = {};
            // DON'T clear user and username on resetAuth - only clear UI states
            console.log('🔄 resetAuth completed, user data preserved:', {
                hasUser: !!state.user,
                username: state.username || 'none'
            });
        },        /**
         * Reset login form credentials
         * Clears username and password fields
         * 
         * @param {Object} state - Current authentication state
         */
        resetLogin: (state) => {
            state.username = '';
            state.password = '';
            state.validationErrors = {};
            
            console.log('🔄 Login form credentials cleared');
        },

        /**
         * Logout user and reset session
         * Comprehensive logout that clears session data
         * 
         * @param {Object} state - Current authentication state
         */
        logout: (state) => {
            console.log('🔓 logout called - clearing all auth data');
            state.username = ''; // Clear username too for complete logout
            state.password = '';
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
            state.user = null;
            state.lastLoginAttempt = null;
            state.validationErrors = {};
            
            console.log('� logout completed - all auth data cleared', {
                timestamp: new Date().toISOString()
            });
        },

        /**
         * Set username field value
         * Updates username with basic validation
         * 
         * @param {Object} state - Current authentication state
         * @param {Object} action - Redux action with username payload
         */
        setUsername: (state, action) => {
            state.username = action.payload?.trim() || '';
            
            // Clear username validation errors
            if (state.validationErrors?.username) {
                delete state.validationErrors.username;
            }
            
            // Clear any previous error state if user is typing
            if (state.isError && action.payload) {
                state.isError = false;
                state.message = '';
            }
        },

        /**
         * Set password field value
         * Updates password with security considerations
         * 
         * @param {Object} state - Current authentication state  
         * @param {Object} action - Redux action with password payload
         */
        setPassword: (state, action) => {
            state.password = action.payload || '';
            
            // Clear password validation errors
            if (state.validationErrors?.password) {
                delete state.validationErrors.password;
            }
            
            // Clear any previous error state if user is typing
            if (state.isError && action.payload) {
                state.isError = false;
                state.message = '';
            }
        },

        /**
         * Reset all authentication data
         * Complete reset to initial state
         * 
         * @param {Object} state - Current authentication state
         */
        resetAllDataAuth: (state) => {
            Object.assign(state, initialAuthState);
            
            console.log('🔄 All authentication data reset to initial state');
        },

        /**
         * Set validation errors
         * Updates form validation error state
         * 
         * @param {Object} state - Current authentication state
         * @param {Object} action - Redux action with validation errors
         */
        setValidationErrors: (state, action) => {
            state.validationErrors = action.payload || {};
            state.isError = Object.keys(action.payload || {}).length > 0;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle upload login pending state
            .addCase(uploadLoginAsync.pending, (state, action) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
                state.message = '';
                state.validationErrors = {};
                state.lastLoginAttempt = new Date().toISOString();
                
                console.log('⏳ Login request in progress...', {
                    username: action.meta.arg?.username,
                    timestamp: state.lastLoginAttempt
                });
            })

            // Handle upload login fulfilled state
            .addCase(uploadLoginAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.user = action.payload?.User || null;
                state.message = 'Login successful';
                state.validationErrors = {};
                
                // Clear password for security (keep username for UX)
                state.password = '';
                
                console.log('✅ Login successful:', {
                    username: state.username,
                    hasUserData: !!state.user,
                    timestamp: new Date().toISOString()
                });
            })

            // Handle upload login rejected state
            .addCase(uploadLoginAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.user = null;
                state.message = action.payload || 'Login failed';
                
                // Clear password on failed attempts for security
                state.password = '';
                
                console.error('❌ Login failed:', {
                    username: state.username,
                    error: state.message,
                    timestamp: new Date().toISOString()
                });
            });
    }
});

// ===== SELECTORS =====

/**
 * Authentication selectors for component consumption
 * Provides optimized state access for React components
 */

/**
 * Select authentication loading state
 * @param {Object} state - Redux root state
 * @returns {boolean} Whether authentication request is in progress
 */
export const selectAuthLoading = (state) => state.auth?.isLoading || false;

/**
 * Select authentication success state
 * @param {Object} state - Redux root state
 * @returns {boolean} Whether authentication was successful
 */
export const selectAuthSuccess = (state) => state.auth?.isSuccess || false;

/**
 * Select authentication error state
 * @param {Object} state - Redux root state
 * @returns {boolean} Whether authentication has error
 */
export const selectAuthError = (state) => state.auth?.isError || false;

/**
 * Select authentication error message
 * @param {Object} state - Redux root state
 * @returns {string} Current authentication message
 */
export const selectAuthMessage = (state) => state.auth?.message || '';

/**
 * Select current user data
 * @param {Object} state - Redux root state
 * @returns {Object|null} Authenticated user data
 */
export const selectCurrentUser = (state) => state.auth?.user || null;

/**
 * Select username field value
 * @param {Object} state - Redux root state
 * @returns {string} Current username input
 */
export const selectUsername = (state) => state.auth?.username || '';

/**
 * Select validation errors
 * @param {Object} state - Redux root state
 * @returns {Object} Current validation errors
 */
export const selectValidationErrors = (state) => state.auth?.validationErrors || {};

/**
 * Select whether user is authenticated
 * @param {Object} state - Redux root state
 * @returns {boolean} Whether user has valid session
 */
export const selectIsAuthenticated = (state) => {
    // Check for user data and username, not just isSuccess flag
    // isSuccess is temporary UI state, user data indicates actual authentication
    const hasValidUser = !!(state.auth?.user);
    const hasUsername = !!(state.auth?.username?.trim());
    
    console.log('🔍 selectIsAuthenticated check:', {
        hasValidUser,
        hasUsername,
        isSuccess: state.auth?.isSuccess,
        result: hasValidUser && hasUsername
    });
    
    return hasValidUser && hasUsername;
};

/**
 * Select authentication form state
 * @param {Object} state - Redux root state
 * @returns {Object} Complete form state for components
 */
export const selectAuthFormState = (state) => ({
    username: selectUsername(state),
    isLoading: selectAuthLoading(state),
    isError: selectAuthError(state),
    message: selectAuthMessage(state),
    validationErrors: selectValidationErrors(state),
    canSubmit: selectUsername(state).length >= 3 && !selectAuthLoading(state)
});

// ===== EXPORTS =====

/**
 * Export actions for component consumption
 */
export const { 
    resetAuth, 
    resetLogin, 
    setUsername, 
    setPassword, 
    logout, 
    resetAllDataAuth,
    setValidationErrors
} = authSlice.actions;

/**
 * Export reducer as default
 */
export default authSlice.reducer;