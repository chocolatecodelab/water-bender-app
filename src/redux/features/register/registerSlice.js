/**
 * Register/User Registration Redux Slice
 * 
 * Redux Toolkit slice for managing user registration state and processes.
 * Handles user registration form data, validation, registration requests,
 * and registration flow state management.
 * 
 * Features:
 * - User registration form state management
 * - Registration request handling with async thunks
 * - Comprehensive form validation
 * - Loading, error, and success state management
 * - Registration flow control
 * - Input sanitization and validation
 * - Password strength validation
 * - Email format validation
 * 
 * State Structure:
 * - isError: Registration error flag
 * - isSuccess: Registration success flag
 * - isLoading: Registration request in progress
 * - message: Status/error messages
 * - validationErrors: Form field validation errors
 * - registrationData: Temporary registration data
 * - lastRegistrationAttempt: Timestamp tracking
 * 
 * @file src/redux/features/register/registerSlice.js
 * @version 1.0.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadRegisterAsync } from './registerService';

// ===== UTILITIES =====

/**
 * Extract error message from various error formats
 * Provides consistent error message extraction for registration errors
 * 
 * @param {Error|Object} error - Error object from API or validation
 * @returns {string} Human-readable error message
 */
const extractErrorMessage = (error) => {
    // Handle structured API error responses
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    
    // Handle validation error arrays
    if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        return error.response.data.errors.join(', ');
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
            return parsedError?.data?.message || parsedError?.message || 'Registration failed';
        } catch (parseError) {
            return 'Registration failed';
        }
    }
    
    // Default fallback message
    return 'An unexpected registration error occurred';
};

/**
 * Validate registration form data
 * Comprehensive client-side validation before sending registration request
 * 
 * @param {Object} registrationData - User registration data
 * @param {string} registrationData.username - Username
 * @param {string} registrationData.email - Email address
 * @param {string} registrationData.password - Password
 * @param {string} registrationData.confirmPassword - Password confirmation
 * @param {string} registrationData.fullName - Full name
 * @returns {Object} Validation result with errors
 */
const validateRegistrationData = (registrationData) => {
    const errors = {};
    
    // Validate username
    if (!registrationData?.username?.trim()) {
        errors.username = 'Username is required';
    } else if (registrationData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
    } else if (registrationData.username.length > 30) {
        errors.username = 'Username must not exceed 30 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(registrationData.username)) {
        errors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    // Validate email
    if (!registrationData?.email?.trim()) {
        errors.email = 'Email is required';
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registrationData.email)) {
            errors.email = 'Please enter a valid email address';
        }
    }
    
    // Validate password
    if (!registrationData?.password) {
        errors.password = 'Password is required';
    } else if (registrationData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    } else {
        // Check password strength
        const hasUpperCase = /[A-Z]/.test(registrationData.password);
        const hasLowerCase = /[a-z]/.test(registrationData.password);
        const hasNumbers = /\d/.test(registrationData.password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(registrationData.password);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
            errors.password = 'Password must contain uppercase, lowercase, and numbers';
        }
    }
    
    // Validate password confirmation
    if (!registrationData?.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
    } else if (registrationData.password !== registrationData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate full name
    if (!registrationData?.fullName?.trim()) {
        errors.fullName = 'Full name is required';
    } else if (registrationData.fullName.length < 2) {
        errors.fullName = 'Full name must be at least 2 characters';
    } else if (registrationData.fullName.length > 50) {
        errors.fullName = 'Full name must not exceed 50 characters';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Sanitize registration data
 * Clean and prepare registration data for API submission
 * 
 * @param {Object} data - Raw registration form data
 * @returns {Object} Sanitized registration data
 */
const sanitizeRegistrationData = (data) => {
    return {
        username: data.username?.trim()?.toLowerCase(),
        email: data.email?.trim()?.toLowerCase(),
        password: data.password,
        fullName: data.fullName?.trim(),
        // Remove confirmPassword from final submission
        ...Object.fromEntries(
            Object.entries(data).filter(([key]) => key !== 'confirmPassword')
        )
    };
};

// ===== ASYNC THUNKS =====

/**
 * Fetch Register Async Thunk
 * 
 * Handles user registration with comprehensive validation,
 * sanitization, and error handling.
 * 
 * @async
 * @function fetchRegister
 * @param {Object} data - User registration data
 * @param {string} data.username - User's chosen username
 * @param {string} data.email - User's email address
 * @param {string} data.password - User's password
 * @param {string} data.confirmPassword - Password confirmation
 * @param {string} data.fullName - User's full name
 * @param {Object} thunkAPI - Redux Toolkit thunk API
 * @returns {Promise<Object>} Registration result or rejection
 * 
 * @example
 * dispatch(fetchRegister({
 *   username: 'john_doe',
 *   email: 'john@example.com',
 *   password: 'SecurePass123',
 *   confirmPassword: 'SecurePass123',
 *   fullName: 'John Doe'
 * }));
 */
export const fetchRegister = createAsyncThunk(
    'register/fetchRegister',
    async (data, thunkAPI) => {
        try {
            // Validate registration data before processing
            const validation = validateRegistrationData(data);
            if (!validation.isValid) {
                const errorMessage = Object.values(validation.errors).join(', ');
                return thunkAPI.rejectWithValue(errorMessage);
            }

            // Sanitize data before submission
            const sanitizedData = sanitizeRegistrationData(data);

            console.log('🔄 Starting user registration process...', {
                username: sanitizedData.username,
                email: sanitizedData.email,
                timestamp: new Date().toISOString(),
                attempt: Date.now()
            });

            // Attempt registration through service layer
            const result = await uploadRegisterAsync(sanitizedData);

            console.log('✅ User registration successful:', {
                username: sanitizedData.username,
                email: sanitizedData.email,
                hasResult: !!result,
                timestamp: new Date().toISOString()
            });

            return {
                ...result,
                registrationTimestamp: new Date().toISOString(),
                registeredUsername: sanitizedData.username,
                registeredEmail: sanitizedData.email
            };

        } catch (error) {
            console.error('❌ User registration failed:', {
                username: data?.username,
                email: data?.email,
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
 * Initial registration state
 * Defines the default state structure for user registration
 */
const initialRegistrationState = {
    // Request state flags
    isError: false,
    isSuccess: false,
    isLoading: false,
    
    // Messages and validation
    message: '',
    validationErrors: {},
    
    // Registration tracking
    lastRegistrationAttempt: null,
    registrationData: null,
    
    // Form state
    step: 1, // Multi-step registration support
    totalSteps: 1
};

// ===== SLICE DEFINITION =====

/**
 * Registration Redux Slice
 * 
 * Manages user registration state and provides actions for:
 * - Registration form management
 * - Registration request processing
 * - Validation error handling
 * - Registration flow control
 */
export const registerSlice = createSlice({
    name: 'register',
    initialState: initialRegistrationState,
    reducers: {
        /**
         * Reset registration state
         * Clears all registration state flags and messages
         * 
         * @param {Object} state - Current registration state
         */
        resetRegister: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
            state.validationErrors = {};
            state.registrationData = null;
            
            console.log('🔄 Registration state reset');
        },

        /**
         * Reset error state
         * Clears only error-related state while preserving other data
         * 
         * @param {Object} state - Current registration state
         */
        resetError: (state) => {
            state.isError = false;
            state.message = '';
            state.validationErrors = {};
            
            console.log('🔄 Registration errors cleared');
        },

        /**
         * Reset success state
         * Clears success state while preserving other data
         * 
         * @param {Object} state - Current registration state
         */
        resetSuccess: (state) => {
            state.isSuccess = false;
            
            console.log('🔄 Registration success state cleared');
        },

        /**
         * Set validation errors
         * Updates form validation error state
         * 
         * @param {Object} state - Current registration state
         * @param {Object} action - Redux action with validation errors
         */
        setValidationErrors: (state, action) => {
            state.validationErrors = action.payload || {};
            state.isError = Object.keys(action.payload || {}).length > 0;
            
            if (state.isError) {
                state.message = 'Please correct the form errors';
            }
        },

        /**
         * Clear all registration data
         * Complete reset including any stored registration data
         * 
         * @param {Object} state - Current registration state
         */
        clearAllRegistrationData: (state) => {
            Object.assign(state, initialRegistrationState);
            
            console.log('🔄 All registration data cleared');
        },

        /**
         * Set registration step
         * For multi-step registration flows
         * 
         * @param {Object} state - Current registration state
         * @param {Object} action - Redux action with step number
         */
        setRegistrationStep: (state, action) => {
            const step = Number(action.payload) || 1;
            state.step = Math.max(1, Math.min(state.totalSteps, step));
        },

        /**
         * Clear specific validation error
         * Removes validation error for a specific field
         * 
         * @param {Object} state - Current registration state
         * @param {Object} action - Redux action with field name
         */
        clearFieldError: (state, action) => {
            const fieldName = action.payload;
            if (state.validationErrors[fieldName]) {
                delete state.validationErrors[fieldName];
                
                // Clear general error state if no more validation errors
                if (Object.keys(state.validationErrors).length === 0) {
                    state.isError = false;
                    state.message = '';
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle registration pending state
            .addCase(fetchRegister.pending, (state, action) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
                state.message = '';
                state.validationErrors = {};
                state.lastRegistrationAttempt = new Date().toISOString();
                
                console.log('⏳ Registration request in progress...', {
                    username: action.meta.arg?.username,
                    email: action.meta.arg?.email,
                    timestamp: state.lastRegistrationAttempt
                });
            })

            // Handle registration fulfilled state
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.message = 'Registration successful! Please check your email for verification.';
                state.validationErrors = {};
                state.registrationData = {
                    username: action.payload?.registeredUsername,
                    email: action.payload?.registeredEmail,
                    timestamp: action.payload?.registrationTimestamp
                };
                
                console.log('✅ Registration successful:', {
                    username: action.payload?.registeredUsername,
                    email: action.payload?.registeredEmail,
                    timestamp: new Date().toISOString()
                });
            })

            // Handle registration rejected state
            .addCase(fetchRegister.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload || 'Registration failed';
                state.registrationData = null;
                
                console.error('❌ Registration failed:', {
                    error: state.message,
                    timestamp: new Date().toISOString()
                });
            });
    }
});

// ===== SELECTORS =====

/**
 * Registration selectors for component consumption
 * Provides optimized state access for React components
 */

/**
 * Select registration loading state
 * @param {Object} state - Redux root state
 * @returns {boolean} Whether registration request is in progress
 */
export const selectRegistrationLoading = (state) => state.register?.isLoading || false;

/**
 * Select registration success state
 * @param {Object} state - Redux root state
 * @returns {boolean} Whether registration was successful
 */
export const selectRegistrationSuccess = (state) => state.register?.isSuccess || false;

/**
 * Select registration error state
 * @param {Object} state - Redux root state
 * @returns {boolean} Whether registration has error
 */
export const selectRegistrationError = (state) => state.register?.isError || false;

/**
 * Select registration message
 * @param {Object} state - Redux root state
 * @returns {string} Current registration status message
 */
export const selectRegistrationMessage = (state) => state.register?.message || '';

/**
 * Select validation errors
 * @param {Object} state - Redux root state
 * @returns {Object} Current form validation errors
 */
export const selectValidationErrors = (state) => state.register?.validationErrors || {};

/**
 * Select registration data
 * @param {Object} state - Redux root state
 * @returns {Object|null} Registration result data
 */
export const selectRegistrationData = (state) => state.register?.registrationData || null;

/**
 * Select current registration step
 * @param {Object} state - Redux root state
 * @returns {number} Current step in multi-step registration
 */
export const selectRegistrationStep = (state) => state.register?.step || 1;

/**
 * Select if registration can be submitted
 * @param {Object} state - Redux root state
 * @returns {boolean} Whether registration form can be submitted
 */
export const selectCanSubmitRegistration = (state) => {
    return !selectRegistrationLoading(state) && 
           Object.keys(selectValidationErrors(state)).length === 0;
};

/**
 * Select complete registration form state
 * @param {Object} state - Redux root state
 * @returns {Object} Complete form state for components
 */
export const selectRegistrationFormState = (state) => ({
    isLoading: selectRegistrationLoading(state),
    isError: selectRegistrationError(state),
    isSuccess: selectRegistrationSuccess(state),
    message: selectRegistrationMessage(state),
    validationErrors: selectValidationErrors(state),
    canSubmit: selectCanSubmitRegistration(state),
    step: selectRegistrationStep(state)
});

// ===== EXPORTS =====

/**
 * Export actions for component consumption
 */
export const { 
    resetRegister, 
    resetError, 
    resetSuccess,
    setValidationErrors,
    clearAllRegistrationData,
    setRegistrationStep,
    clearFieldError
} = registerSlice.actions;

/**
 * Export reducer as default
 */
export default registerSlice.reducer;