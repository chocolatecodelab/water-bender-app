/**
 * Helper Utilities
 * 
 * @description Common utility functions for the application
 * @module Helper
 * @author KPP Development Team
 * @version 1.0.0
 */

import { Dimensions, Platform } from "react-native";
import DeviceInfo from 'react-native-device-info';

// Icon library imports
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

// Constants
import { 
  HTTP_HEADER_VALUE_JSON, 
  REST_BASE_URL, 
  REST_METHOD_DELETE, 
  REST_METHOD_GET, 
  REST_METHOD_POST, 
  REST_METHOD_PUT 
} from "./constant";

// ========================================
// ICON TOOLS
// ========================================

/**
 * Collection of icon libraries for easy access
 * @type {Object}
 */
export const iconTools = {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
  AntDesign,
  Entypo,
  Octicons,
  EvilIcons,
};

// ========================================
// PLATFORM DETECTION
// ========================================

/**
 * Platform detection utilities
 */
export const ios = Platform.OS === 'ios';
export const android = Platform.OS === 'android';
export const iPad = DeviceInfo.getModel().includes('iPad');

// ========================================
// DATE AND TIME UTILITIES
// ========================================

/**
 * Indonesian month names for localization
 * @type {string[]}
 */
export const stringMonth = [
  "Jan",
  "Feb", 
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des"
];

/**
 * Get current date formatted in Indonesian locale
 * @returns {string} Formatted date string
 */
export const getCurrentDateIndonesian = () => {
  const now = new Date();
  const day = now.getDate();
  const month = stringMonth[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
};

// ========================================
// SCREEN UTILITIES
// ========================================

/**
 * Get device screen dimensions
 * @returns {Object} Screen dimensions with height and width
 */
export const getScreenDimension = () => {
  const { height, width } = Dimensions.get('window');
  return { height, width };
};

/**
 * Check if device is in landscape mode
 * @returns {boolean} True if landscape, false if portrait
 */
export const isLandscape = () => {
  const { height, width } = getScreenDimension();
  return width > height;
};

// ========================================
// ARRAY UTILITIES
// ========================================

/**
 * Sort array in ascending order
 * @param {*} a - First element
 * @param {*} b - Second element
 * @returns {number} Sort comparison result
 */
export const sortAsc = (a, b) => (a > b ? 1 : -1);

/**
 * Sort array in descending order
 * @param {*} a - First element
 * @param {*} b - Second element
 * @returns {number} Sort comparison result
 */
export const sortDesc = (a, b) => (a > b ? -1 : 1);

/**
 * Convert array to object using specified key
 * @param {Array} array - Array to convert
 * @param {string} objKey - Key to use for object mapping
 * @returns {Object} Converted object
 */
export const convertArrToObj = (array, objKey) => {
  if (!array || !Array.isArray(array)) return {};
  
  return array.reduce(
    (obj, item) => ({ ...obj, [item[objKey]]: item }), 
    {}
  );
};

/**
 * Remove duplicates from array based on key
 * @param {Array} array - Array with potential duplicates
 * @param {string} key - Key to check for uniqueness
 * @returns {Array} Array without duplicates
 */
export const removeDuplicates = (array, key) => {
  if (!array || !Array.isArray(array)) return [];
  
  const seen = new Set();
  return array.filter(item => {
    const keyValue = item[key];
    if (seen.has(keyValue)) {
      return false;
    }
    seen.add(keyValue);
    return true;
  });
};

// ========================================
// HTTP UTILITIES
// ========================================

/**
 * Get HTTP headers for API requests
 * @param {string} authenticationToken - Optional authentication token
 * @returns {Object} HTTP headers object
 */
const getHttpHeaders = async (authenticationToken) => {
  let headers = {
    'Content-Type': HTTP_HEADER_VALUE_JSON,
  };

  if (authenticationToken) {
    headers = { ...headers, Authorization: `Bearer ${authenticationToken}` };
  }
  
  return headers;
};

/**
 * Get HTTP headers for form data requests
 * @param {string} authenticationToken - Optional authentication token
 * @returns {Object} HTTP headers object for form data
 */
const getHttpHeadersFormData = async (authenticationToken) => {
  let headers = {
    'Content-Type': 'multipart/form-data',
  };

  if (authenticationToken) {
    headers = { ...headers, Authorization: `Bearer ${authenticationToken}` };
  }
  
  return headers;
};

/**
 * Process HTTP response and handle errors
 * @param {Response} response - Fetch response object
 * @param {string} url - Request URL for debugging
 * @returns {Object} Parsed JSON response
 * @throws {Error} If response status indicates error
 */
const processResponse = async (response, url) => {
  try {
    const responseJSON = await response.json();
    
    if (response.status >= 200 && response.status <= 299) {
      return responseJSON;
    }

    // Handle error responses
    const errorMessage = responseJSON?.Message || responseJSON?.message || `HTTP Error ${response.status}`;
    console.error(`API Error for ${url}:`, errorMessage);
    throw new Error(errorMessage);
    
  } catch (error) {
    console.error(`Response processing error for ${url}:`, error.message);
    throw error;
  }
};

// ========================================
// API REQUEST METHODS
// ========================================

/**
 * Send GET request to API
 * @param {string} apiPath - API endpoint path
 * @param {string} authenticationToken - Optional authentication token
 * @param {string} customBaseUrl - Optional custom base URL
 * @returns {Promise<Object>} API response
 */
export const sendGetRequest = async (apiPath, authenticationToken, customBaseUrl) => {
  try {
    const url = customBaseUrl ? `${customBaseUrl}${apiPath}` : `${REST_BASE_URL}${apiPath}`;
    const method = REST_METHOD_GET;
    const headers = await getHttpHeaders(authenticationToken);
    
    console.log(`GET Request: ${url}`);
    const response = await fetch(url, { method, headers });
    
    return processResponse(response, url);
  } catch (error) {
    console.error(`GET Request failed for ${apiPath}:`, error.message);
    throw error;
  }
};

/**
 * Send POST request to API
 * @param {string} apiPath - API endpoint path
 * @param {Object} body - Request body data
 * @param {string} authenticationToken - Optional authentication token
 * @param {string} customBaseUrl - Optional custom base URL
 * @returns {Promise<Object>} API response
 */
export const sendPostRequest = async (apiPath, body, authenticationToken, customBaseUrl) => {
  try {
    const bodyStr = JSON.stringify(body);
    const url = customBaseUrl ? `${customBaseUrl}${apiPath}` : `${REST_BASE_URL}${apiPath}`;
    const method = REST_METHOD_POST;
    const headers = await getHttpHeaders(authenticationToken);
    
    console.log(`POST Request: ${url}`, body);
    const response = await fetch(url, { method, headers, body: bodyStr });
    
    return processResponse(response, url);
  } catch (error) {
    console.error(`POST Request failed for ${apiPath}:`, error.message);
    throw error;
  }
};

/**
 * Send POST request with form data to API
 * @param {string} apiPath - API endpoint path
 * @param {FormData} body - Form data body
 * @param {string} authenticationToken - Optional authentication token
 * @param {string} customBaseUrl - Optional custom base URL
 * @returns {Promise<Object>} API response
 */
export const sendPostFormRequest = async (apiPath, body, authenticationToken, customBaseUrl) => {
  try {
    const url = customBaseUrl ? `${customBaseUrl}${apiPath}` : `${REST_BASE_URL}${apiPath}`;
    const method = REST_METHOD_POST;
    const headers = await getHttpHeadersFormData(authenticationToken);
    
    console.log(`POST Form Request: ${url}`);
    const response = await fetch(url, { method, headers, body });
    
    return processResponse(response, url);
  } catch (error) {
    console.error(`POST Form Request failed for ${apiPath}:`, error.message);
    throw error;
  }
};

/**
 * Send PUT request to API
 * @param {string} apiPath - API endpoint path
 * @param {Object} body - Request body data
 * @param {string} authenticationToken - Optional authentication token
 * @param {string} customBaseUrl - Optional custom base URL
 * @returns {Promise<Object>} API response
 */
export const sendPutRequest = async (apiPath, body, authenticationToken, customBaseUrl) => {
  try {
    const bodyStr = JSON.stringify(body);
    const url = customBaseUrl ? `${customBaseUrl}${apiPath}` : `${REST_BASE_URL}${apiPath}`;
    const method = REST_METHOD_PUT;
    const headers = await getHttpHeaders(authenticationToken);
    
    console.log(`PUT Request: ${url}`, body);
    const response = await fetch(url, { method, headers, body: bodyStr });
    
    return processResponse(response, url);
  } catch (error) {
    console.error(`PUT Request failed for ${apiPath}:`, error.message);
    throw error;
  }
};

/**
 * Send DELETE request to API
 * @param {string} apiPath - API endpoint path
 * @param {string} authenticationToken - Optional authentication token
 * @param {string} customBaseUrl - Optional custom base URL
 * @returns {Promise<Object>} API response
 */
export const sendDeleteRequest = async (apiPath, authenticationToken, customBaseUrl) => {
  try {
    const url = customBaseUrl ? `${customBaseUrl}${apiPath}` : `${REST_BASE_URL}${apiPath}`;
    const method = REST_METHOD_DELETE;
    const headers = await getHttpHeaders(authenticationToken);
    
    console.log(`DELETE Request: ${url}`);
    const response = await fetch(url, { method, headers });
    
    return processResponse(response, url);
  } catch (error) {
    console.error(`DELETE Request failed for ${apiPath}:`, error.message);
    throw error;
  }
};

// ========================================
// VALIDATION UTILITIES
// ========================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum password length (default: 6)
 * @returns {Object} Validation result with isValid and message
 */
export const validatePassword = (password, minLength = 6) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < minLength) {
    return { isValid: false, message: `Password must be at least ${minLength} characters` };
  }
  
  return { isValid: true, message: 'Password is valid' };
};

// ========================================
// NOTIFICATION UTILITIES
// ========================================

/**
 * Display notification to user
 * @param {string} title - Notification title
 * @param {string} description - Notification description
 * @param {string} conditional - Optional conditional text
 */
export const onDisplayNotification = async (title, description, conditional = "") => {
  // Implementation would depend on notification library
  console.log('Notification:', { title, description, conditional });
  
  // TODO: Implement actual notification display
  // This is a placeholder for future notification implementation
};

// ========================================
// FORMATTING UTILITIES
// ========================================

/**
 * Format number with thousands separator
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  if (typeof number !== 'number') return '0';
  return number.toLocaleString('id-ID');
};

/**
 * Format currency in Indonesian Rupiah
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
