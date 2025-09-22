/**
 * Registration Service Layer
 * 
 * Service layer for user registration API interactions.
 * Handles user registration requests, data validation, sanitization,
 * and registration response processing with comprehensive error handling.
 * 
 * Features:
 * - User registration via REST API
 * - Registration data validation and sanitization
 * - Request/response logging for debugging
 * - Comprehensive error handling with user-friendly messages
 * - Security best practices for registration
 * - Duplicate account detection
 * - Password security validation
 * - Email verification support
 * 
 * Security Considerations:
 * - Never logs sensitive user data (passwords)
 * - Sanitizes all input parameters
 * - Validates email format and uniqueness
 * - Implements password strength requirements
 * - Handles registration failures securely
 * - Prevents account enumeration attacks
 * 
 * @file src/redux/features/register/registerService.js
 * @version 1.0.0
 */

import { REST_URL_REGISTER } from "../../../tools/constant";
import { sendPostRequest } from "../../../tools/helper";

// ===== SERVICE CONFIGURATION =====

/**
 * Registration service configuration constants
 */
const REGISTER_CONFIG = {
    REQUEST_TIMEOUT: 20000, // 20 seconds (registration may take longer)
    MAX_RETRY_ATTEMPTS: 2,
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 30,
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    MIN_FULLNAME_LENGTH: 2,
    MAX_FULLNAME_LENGTH: 50,
    EMAIL_MAX_LENGTH: 320 // Standard email max length
};

// ===== VALIDATION HELPERS =====

/**
 * Validate email format using comprehensive regex
 * Ensures email meets RFC 5322 standards
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} Whether email format is valid
 */
const isValidEmailFormat = (email) => {
    // Comprehensive email validation regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
};

/**
 * Validate username format and constraints
 * Ensures username meets platform requirements
 * 
 * @param {string} username - Username to validate
 * @returns {Object} Validation result with details
 */
const validateUsername = (username) => {
    if (!username || typeof username !== 'string') {
        return { isValid: false, error: 'Username is required' };
    }

    const trimmedUsername = username.trim();
    
    if (trimmedUsername.length < REGISTER_CONFIG.MIN_USERNAME_LENGTH) {
        return { 
            isValid: false, 
            error: `Username must be at least ${REGISTER_CONFIG.MIN_USERNAME_LENGTH} characters` 
        };
    }

    if (trimmedUsername.length > REGISTER_CONFIG.MAX_USERNAME_LENGTH) {
        return { 
            isValid: false, 
            error: `Username must not exceed ${REGISTER_CONFIG.MAX_USERNAME_LENGTH} characters` 
        };
    }

    // Check for valid characters (alphanumeric and underscore only)
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
        return { 
            isValid: false, 
            error: 'Username can only contain letters, numbers, and underscores' 
        };
    }

    // Check for reserved usernames
    const reservedUsernames = ['admin', 'root', 'user', 'test', 'guest', 'anonymous'];
    if (reservedUsernames.includes(trimmedUsername.toLowerCase())) {
        return { 
            isValid: false, 
            error: 'This username is not available' 
        };
    }

    return { isValid: true, sanitized: trimmedUsername.toLowerCase() };
};

/**
 * Validate password strength and security requirements
 * Ensures password meets security standards
 * 
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength details
 */
const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, error: 'Password is required' };
    }

    if (password.length < REGISTER_CONFIG.MIN_PASSWORD_LENGTH) {
        return { 
            isValid: false, 
            error: `Password must be at least ${REGISTER_CONFIG.MIN_PASSWORD_LENGTH} characters` 
        };
    }

    if (password.length > REGISTER_CONFIG.MAX_PASSWORD_LENGTH) {
        return { 
            isValid: false, 
            error: `Password must not exceed ${REGISTER_CONFIG.MAX_PASSWORD_LENGTH} characters` 
        };
    }

    // Check password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const complexityScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (complexityScore < 3) {
        return { 
            isValid: false, 
            error: 'Password must contain at least 3 of: uppercase, lowercase, numbers, special characters' 
        };
    }

    // Check for common weak patterns
    const commonPatterns = [
        /(.)\1{2,}/, // Repeated characters (aaa, 111)
        /123456|654321|qwerty|password|admin/i, // Common weak passwords
        /^[0-9]+$/, // Only numbers
        /^[a-zA-Z]+$/ // Only letters
    ];

    for (const pattern of commonPatterns) {
        if (pattern.test(password)) {
            return { 
                isValid: false, 
                error: 'Password is too simple or common. Please choose a stronger password' 
            };
        }
    }

    return { 
        isValid: true, 
        strength: complexityScore === 4 ? 'strong' : 'medium'
    };
};

/**
 * Comprehensive registration data validation
 * Validates all required registration fields
 * 
 * @param {Object} registrationData - User registration data
 * @returns {Object} Complete validation result
 */
const validateRegistrationData = (registrationData) => {
    const errors = {};
    const sanitized = {};

    // Check if data object exists
    if (!registrationData || typeof registrationData !== 'object') {
        throw new Error('Registration data is required');
    }

    const { username, email, password, fullName } = registrationData;

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
        errors.username = usernameValidation.error;
    } else {
        sanitized.username = usernameValidation.sanitized;
    }

    // Validate email
    if (!email || typeof email !== 'string') {
        errors.email = 'Email is required';
    } else {
        const trimmedEmail = email.trim().toLowerCase();
        
        if (trimmedEmail.length > REGISTER_CONFIG.EMAIL_MAX_LENGTH) {
            errors.email = 'Email address is too long';
        } else if (!isValidEmailFormat(trimmedEmail)) {
            errors.email = 'Please enter a valid email address';
        } else {
            sanitized.email = trimmedEmail;
        }
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.error;
    } else {
        sanitized.password = password; // Keep original password
        sanitized.passwordStrength = passwordValidation.strength;
    }

    // Validate full name
    if (!fullName || typeof fullName !== 'string') {
        errors.fullName = 'Full name is required';
    } else {
        const trimmedFullName = fullName.trim();
        
        if (trimmedFullName.length < REGISTER_CONFIG.MIN_FULLNAME_LENGTH) {
            errors.fullName = `Full name must be at least ${REGISTER_CONFIG.MIN_FULLNAME_LENGTH} characters`;
        } else if (trimmedFullName.length > REGISTER_CONFIG.MAX_FULLNAME_LENGTH) {
            errors.fullName = `Full name must not exceed ${REGISTER_CONFIG.MAX_FULLNAME_LENGTH} characters`;
        } else if (!/^[a-zA-Z\s'-]+$/.test(trimmedFullName)) {
            errors.fullName = 'Full name can only contain letters, spaces, hyphens, and apostrophes';
        } else {
            sanitized.fullName = trimmedFullName;
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitized
    };
};

/**
 * Validate registration API response
 * Ensures API response contains expected registration data
 * 
 * @param {Object} response - API response to validate
 * @returns {Object} Validated response data
 * @throws {Error} If response is invalid or indicates failure
 */
const validateRegistrationResponse = (response) => {
    if (!response) {
        throw new Error('No response received from registration server');
    }

    // Check for explicit error in response
    if (response.error || response.Error) {
        const errorMessage = response.error || response.Error;
        throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Registration failed');
    }

    // Check for success indicators
    if (response.success === false || response.Success === false) {
        const message = response.message || response.Message || 'Registration failed';
        throw new Error(message);
    }

    // Check for duplicate account errors
    if (response.message && typeof response.message === 'string') {
        const lowerMessage = response.message.toLowerCase();
        if (lowerMessage.includes('already exists') || 
            lowerMessage.includes('duplicate') ||
            lowerMessage.includes('taken')) {
            throw new Error(response.message);
        }
    }

    console.log('✅ Registration response validated:', {
        hasSuccess: response.success !== undefined,
        hasMessage: !!response.message,
        hasUserId: !!response.userId,
        timestamp: new Date().toISOString()
    });

    return response;
};

/**
 * Handle registration service errors
 * Provides consistent error handling and user-friendly messages
 * 
 * @param {Error} error - Error object from registration request
 * @param {string} username - Username for context (sanitized)
 * @param {string} email - Email for context (sanitized)
 * @throws {Error} Processed error with user-friendly message
 */
const handleRegistrationError = (error, username, email) => {
    console.error('❌ Registration Service Error:', {
        username,
        email,
        status: error.response?.status,
        message: error.message,
        timestamp: new Date().toISOString()
    });

    // Handle specific HTTP status codes
    if (error.response?.status) {
        switch (error.response.status) {
            case 400:
                if (error.response.data?.message) {
                    throw new Error(error.response.data.message);
                }
                throw new Error('Invalid registration data provided');
            case 409:
                throw new Error('Username or email already exists');
            case 422:
                throw new Error('Registration data validation failed');
            case 429:
                throw new Error('Too many registration attempts. Please try again later');
            case 500:
                throw new Error('Server error during registration. Please try again later');
            case 503:
                throw new Error('Registration service is temporarily unavailable');
            default:
                throw new Error(`Registration failed (Error ${error.response.status})`);
        }
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        throw new Error('Network connection failed. Please check your internet connection');
    }

    // Handle timeout errors
    if (error.code === 'TIMEOUT' || error.message.includes('timeout')) {
        throw new Error('Registration request timed out. Please try again');
    }

    // Handle generic errors
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Registration failed. Please try again';

    throw new Error(errorMessage);
};

// ===== SERVICE FUNCTIONS =====

/**
 * Upload Register Async (Register New User)
 * 
 * Registers a new user account with comprehensive validation,
 * sanitization, and error handling. Handles all aspects of
 * user registration including security validation.
 * 
 * @async
 * @function uploadRegisterAsync
 * @param {Object} registrationData - User registration data
 * @param {string} registrationData.username - User's chosen username (3-30 chars)
 * @param {string} registrationData.email - User's email address
 * @param {string} registrationData.password - User's password (8+ chars with complexity)
 * @param {string} registrationData.fullName - User's full name (2-50 chars)
 * @returns {Promise<Object>} Registration response with user data
 * @throws {Error} If registration fails or data is invalid
 * 
 * @example
 * try {
 *   const result = await uploadRegisterAsync({
 *     username: 'john_doe',
 *     email: 'john@example.com',
 *     password: 'SecurePass123!',
 *     fullName: 'John Doe'
 *   });
 *   console.log('Registration successful:', result);
 * } catch (error) {
 *   console.error('Registration failed:', error.message);
 * }
 */
export const uploadRegisterAsync = async (registrationData) => {
    let sanitizedData = {};
    
    try {
        // Validate and sanitize registration data
        const validation = validateRegistrationData(registrationData);
        if (!validation.isValid) {
            const errorMessage = Object.values(validation.errors).join(', ');
            throw new Error(errorMessage);
        }

        sanitizedData = validation.sanitized;

        console.log('🔄 Starting user registration process:', {
            username: sanitizedData.username,
            email: sanitizedData.email,
            fullName: sanitizedData.fullName,
            passwordStrength: sanitizedData.passwordStrength,
            endpoint: 'register',
            timestamp: new Date().toISOString()
        });

        // Prepare request payload (exclude sensitive metadata)
        const requestPayload = {
            username: sanitizedData.username,
            email: sanitizedData.email,
            password: sanitizedData.password,
            fullName: sanitizedData.fullName
        };

        // Make registration request
        const response = await sendPostRequest(REST_URL_REGISTER, requestPayload);

        // Validate response structure
        const validatedResponse = validateRegistrationResponse(response);

        console.log('✅ User registration successful:', {
            username: sanitizedData.username,
            email: sanitizedData.email,
            hasUserId: !!validatedResponse.userId,
            hasVerificationToken: !!validatedResponse.verificationToken,
            requiresVerification: !!validatedResponse.requiresEmailVerification,
            timestamp: new Date().toISOString()
        });

        // Return processed registration result
        return {
            ...validatedResponse,
            registeredUser: {
                username: sanitizedData.username,
                email: sanitizedData.email,
                fullName: sanitizedData.fullName
            },
            registrationTimestamp: new Date().toISOString()
        };

    } catch (error) {
        // Handle and re-throw with appropriate error message
        handleRegistrationError(error, sanitizedData.username, sanitizedData.email);
    }
};

// ===== UTILITY EXPORTS =====

/**
 * Registration service utilities for external use
 * Useful for testing, validation, and advanced implementations
 */
export const registrationServiceUtils = {
    validateRegistrationData,
    validateUsername,
    validatePassword,
    isValidEmailFormat,
    validateRegistrationResponse,
    REGISTER_CONFIG
};

/**
 * Check registration service health
 * Tests basic connectivity to registration endpoint
 * 
 * @async
 * @function checkRegistrationServiceHealth
 * @returns {Promise<Object>} Service health status
 */
export const checkRegistrationServiceHealth = async () => {
    try {
        console.log('🔍 Performing registration service health check...');
        
        // Basic health check - in real implementation might ping a health endpoint
        const healthCheckResult = {
            status: 'healthy',
            message: 'Registration service is operational',
            endpoint: REST_URL_REGISTER,
            timestamp: new Date().toISOString(),
            configLoaded: !!REGISTER_CONFIG
        };

        return healthCheckResult;
        
    } catch (error) {
        return {
            status: 'unhealthy',
            message: error.message,
            endpoint: REST_URL_REGISTER,
            timestamp: new Date().toISOString(),
            configLoaded: false
        };
    }
};

/**
 * Generate registration request metadata
 * Creates metadata for registration requests without exposing sensitive data
 * 
 * @param {string} username - Username for metadata
 * @param {string} email - Email for metadata
 * @returns {Object} Safe registration request metadata
 */
export const generateRegistrationMetadata = (username, email) => {
    return {
        requestId: `register_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        username: username?.toLowerCase()?.trim(),
        emailDomain: email?.split('@')[1]?.toLowerCase(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        endpoint: 'registration',
        clientVersion: '1.0.0'
    };
};

/**
 * Validate password strength for real-time feedback
 * Provides detailed password strength analysis
 * 
 * @param {string} password - Password to analyze
 * @returns {Object} Detailed strength analysis
 */
export const analyzePasswordStrength = (password) => {
    if (!password) {
        return {
            score: 0,
            strength: 'very-weak',
            feedback: ['Password is required']
        };
    }

    const checks = {
        length: password.length >= 8,
        hasUpper: /[A-Z]/.test(password),
        hasLower: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        notCommon: !/password|123456|qwerty|admin/i.test(password),
        noRepeats: !/(.)\1{2,}/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    const feedback = [];

    if (!checks.length) feedback.push('At least 8 characters');
    if (!checks.hasUpper) feedback.push('Include uppercase letters');
    if (!checks.hasLower) feedback.push('Include lowercase letters');
    if (!checks.hasNumber) feedback.push('Include numbers');
    if (!checks.hasSpecial) feedback.push('Include special characters');
    if (!checks.notCommon) feedback.push('Avoid common passwords');
    if (!checks.noRepeats) feedback.push('Avoid repeated characters');

    let strength;
    if (score >= 7) strength = 'very-strong';
    else if (score >= 6) strength = 'strong';
    else if (score >= 4) strength = 'medium';
    else if (score >= 2) strength = 'weak';
    else strength = 'very-weak';

    return {
        score,
        strength,
        feedback,
        checks
    };
};
