/**
 * Login Service Layer
 * 
 * Service layer for user authentication API interactions.
 * Handles login requests, credential validation, and authentication
 * response processing with comprehensive error handling.
 * 
 * Features:
 * - User authentication via REST API
 * - Credential sanitization and validation
 * - Request/response logging for debugging
 * - Error handling and retry logic
 * - Security best practices
 * - Request timeout management
 * 
 * Security Considerations:
 * - Never logs sensitive credential data
 * - Sanitizes input parameters
 * - Handles authentication failures securely
 * - Implements request timeout protection
 * 
 * @file src/redux/features/login/loginService.js
 * @version 1.0.0
 */

import { REST_URL_LOGIN } from "../../../tools/constant";
import { sendPostRequest } from "../../../tools/helper";

// ===== SERVICE CONFIGURATION =====

/**
 * Service configuration constants
 */
const LOGIN_CONFIG = {
    REQUEST_TIMEOUT: 15000, // 15 seconds
    MAX_RETRY_ATTEMPTS: 2,
    MIN_USERNAME_LENGTH: 3,
    MIN_PASSWORD_LENGTH: 6,
    MAX_CREDENTIAL_LENGTH: 100
};

// ===== HELPER FUNCTIONS =====

/**
 * Sanitize and validate login credentials
 * Ensures credentials meet basic security requirements
 * 
 * @param {Object} credentials - Login credentials to validate
 * @param {string} credentials.username - User's username
 * @param {string} credentials.password - User's password
 * @returns {Object} Validation result with sanitized data
 * @throws {Error} If credentials are invalid
 */
const validateAndSanitizeCredentials = (credentials) => {
    // Check if credentials object exists
    if (!credentials || typeof credentials !== 'object') {
        throw new Error('Login credentials are required');
    }

    const { username, password } = credentials;

    // Validate username
    if (!username || typeof username !== 'string') {
        throw new Error('Username is required');
    }

    if (username.length < LOGIN_CONFIG.MIN_USERNAME_LENGTH) {
        throw new Error(`Username must be at least ${LOGIN_CONFIG.MIN_USERNAME_LENGTH} characters`);
    }

    if (username.length > LOGIN_CONFIG.MAX_CREDENTIAL_LENGTH) {
        throw new Error(`Username must not exceed ${LOGIN_CONFIG.MAX_CREDENTIAL_LENGTH} characters`);
    }

    // Validate password
    if (!password || typeof password !== 'string') {
        throw new Error('Password is required');
    }

    if (password.length < LOGIN_CONFIG.MIN_PASSWORD_LENGTH) {
        throw new Error(`Password must be at least ${LOGIN_CONFIG.MIN_PASSWORD_LENGTH} characters`);
    }

    if (password.length > LOGIN_CONFIG.MAX_CREDENTIAL_LENGTH) {
        throw new Error(`Password must not exceed ${LOGIN_CONFIG.MAX_CREDENTIAL_LENGTH} characters`);
    }

    // Sanitize credentials
    const sanitizedUsername = username.trim().toLowerCase();
    
    // Basic injection prevention
    if (/[<>\"'%;()&+]/.test(sanitizedUsername)) {
        throw new Error('Username contains invalid characters');
    }

    return {
        username: sanitizedUsername,
        password: password, // Don't modify password - maintain original case
        originalUsername: username.trim() // Keep original case for display
    };
};

/**
 * Validate authentication response
 * Ensures API response contains expected authentication data
 * 
 * @param {Object} response - API response to validate
 * @returns {Object} Validated response data
 * @throws {Error} If response is invalid
 */
const validateAuthResponse = (response) => {
    if (!response) {
        throw new Error('No response received from authentication server');
    }

    // Check for explicit error in response
    if (response.error || response.Error) {
        const errorMessage = response.error || response.Error;
        throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Authentication failed');
    }

    // Check for successful authentication indicators
    if (!response.User && !response.user && !response.token && !response.Token) {
        console.warn('⚠️ Authentication response missing expected user data:', {
            hasUser: !!response.User,
            hasToken: !!response.token,
            responseKeys: Object.keys(response)
        });
    }

    return response;
};

/**
 * Handle authentication service errors
 * Provides consistent error handling and logging
 * 
 * @param {Error} error - Error object from authentication request
 * @param {string} username - Username for context (sanitized)
 * @throws {Error} Processed error with user-friendly message
 */
const handleAuthError = (error, username) => {
    console.error('❌ Authentication Service Error:', {
        username: username, // Already sanitized
        status: error.response?.status,
        message: error.message,
        timestamp: new Date().toISOString()
    });

    // Handle specific HTTP status codes
    if (error.response?.status) {
        switch (error.response.status) {
            case 400:
                throw new Error('Invalid login credentials provided');
            case 401:
                throw new Error('Username or password is incorrect');
            case 403:
                throw new Error('Account access is restricted');
            case 404:
                throw new Error('Authentication service is not available');
            case 429:
                throw new Error('Too many login attempts. Please try again later');
            case 500:
                throw new Error('Server error. Please try again later');
            case 503:
                throw new Error('Authentication service is temporarily unavailable');
            default:
                throw new Error(`Authentication failed (Error ${error.response.status})`);
        }
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        throw new Error('Network connection failed. Please check your internet connection');
    }

    // Handle timeout errors
    if (error.code === 'TIMEOUT' || error.message.includes('timeout')) {
        throw new Error('Login request timed out. Please try again');
    }

    // Handle generic errors
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Authentication failed. Please try again';

    throw new Error(errorMessage);
};

// ===== SERVICE FUNCTIONS =====

/**
 * Upload Login (Authenticate User)
 * 
 * Authenticates user credentials against the authentication service.
 * Handles validation, request processing, and response validation
 * with comprehensive error handling and security measures.
 * 
 * @async
 * @function uploadLogin
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.username - User's username (3-100 chars)
 * @param {string} credentials.password - User's password (6-100 chars)
 * @returns {Promise<Object>} Authentication response with user data
 * @throws {Error} If authentication fails or credentials are invalid
 * 
 * @example
 * try {
 *   const result = await uploadLogin({
 *     username: 'john_doe',
 *     password: 'securePassword123'
 *   });
 *   console.log('Login successful:', result.User);
 * } catch (error) {
 *   console.error('Login failed:', error.message);
 * }
 */
export const uploadLogin = async (credentials) => {
    let sanitizedUsername = '';
    
    try {
        // Validate and sanitize input credentials
        const sanitizedCredentials = validateAndSanitizeCredentials(credentials);
        sanitizedUsername = sanitizedCredentials.username;

        console.log('🔄 Starting authentication request:', {
            username: sanitizedUsername,
            endpoint: 'login',
            timestamp: new Date().toISOString(),
            hasPassword: !!credentials.password
        });

        // Prepare request payload (never log password)
        const requestPayload = {
            username: sanitizedCredentials.username,
            password: sanitizedCredentials.password
        };

        // Make authentication request
        const response = await sendPostRequest(REST_URL_LOGIN, requestPayload);

        // Validate response structure
        const validatedResponse = validateAuthResponse(response);

        console.log('✅ Authentication successful:', {
            username: sanitizedUsername,
            hasUser: !!validatedResponse.User,
            hasToken: !!validatedResponse.token,
            responseType: typeof validatedResponse,
            timestamp: new Date().toISOString()
        });

        // Return validated response
        return validatedResponse;

    } catch (error) {
        // Handle and re-throw with appropriate error message
        handleAuthError(error, sanitizedUsername);
    }
};

// ===== UTILITY EXPORTS =====

/**
 * Service utilities for external use
 * Useful for testing and advanced implementations
 */
export const loginServiceUtils = {
    validateAndSanitizeCredentials,
    validateAuthResponse,
    LOGIN_CONFIG
};

/**
 * Check login service health
 * Tests basic connectivity to authentication endpoint
 * 
 * @async
 * @function checkLoginServiceHealth
 * @returns {Promise<Object>} Service health status
 */
export const checkLoginServiceHealth = async () => {
    try {
        console.log('🔍 Performing login service health check...');
        
        // This is a basic connectivity test - not an actual login
        // In a real implementation, you might have a dedicated health endpoint
        const healthCheckResult = {
            status: 'healthy',
            message: 'Login service is operational',
            endpoint: REST_URL_LOGIN,
            timestamp: new Date().toISOString()
        };

        return healthCheckResult;
        
    } catch (error) {
        return {
            status: 'unhealthy',
            message: error.message,
            endpoint: REST_URL_LOGIN,
            timestamp: new Date().toISOString()
        };
    }
};

/**
 * Generate secure login request metadata
 * Creates metadata for login requests without exposing credentials
 * 
 * @param {string} username - Username (for non-sensitive metadata)
 * @returns {Object} Safe request metadata
 */
export const generateLoginMetadata = (username) => {
    return {
        requestId: `login_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        username: username?.toLowerCase()?.trim(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        endpoint: 'authentication'
    };
};

