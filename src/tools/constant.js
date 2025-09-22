/**
 * Application Constants
 * 
 * Central repository for all application-wide constants including:
 * - Navigation route names
 * - API endpoints and configuration
 * - HTTP methods and headers
 * - Color palette and theme
 * - Typography and font sizes
 * 
 * This file ensures consistency across the application and provides
 * a single source of truth for configuration values.
 * 
 * @file src/tools/constant.js
 * @version 1.0.0
 */

// ===== NAVIGATION CONSTANTS =====

/**
 * Navigation route names
 * Used throughout the app for consistent navigation
 */
export const NAV_NAME_SPLASH = 'NAV_NAME_SPLASH';
export const NAV_NAME_DASHBOARD = 'NAV_NAME_DASHBOARD';
export const NAV_NAME_LOGIN = 'NAV_NAME_LOGIN';
export const NAV_NAME_REGISTER = 'NAV_NAME_REGISTER';
export const NAV_NAME_HOME_MENU = 'NAV_NAME_HOME_MENU';
export const NAV_NAME_OTP_LOGIN = 'NAV_NAME_OTP_LOGIN';
export const NAV_NAME_FORGET_PASSWORD = 'NAV_NAME_FORGET_PASSWORD';

// ===== API CONFIGURATION =====

/**
 * Base API URL for all water monitoring services
 * Points to Azure-hosted backend API
 */
export const REST_BASE_URL = 'https://opr-poins-mobile-01-kpd.azurewebsites.net/api';

/**
 * Authentication endpoints
 */
export const REST_URL_LOGIN = '/senselog/Login';
export const REST_URL_REGISTER = '/senselog/Register';

/**
 * Water sensor data endpoints
 * These endpoints provide various water monitoring data:
 * - Latest sensor readings
 * - Historical averages
 * - Daily and monthly aggregations  
 * - Weather forecasts
 */
export const REST_URL_GET_LAST_SENSELOG_WATER_BENDER = '/senselog/Get_Last_Senselog';
export const REST_URL_GET_AVG_SENSELOG_WATER_BENDER = '/senselog/Get_Avg_Senselog?startDate={startDate}&endDate={endDate}';
export const REST_URL_GET_MONTHLY_SENSELOG_WATER_BENDER = '/senselog/Get_MonthlyTrans_WaterBender?year={year}';
export const REST_URL_GET_DAILY_SENSELOG_WATER_BENDER = '/senselog/Get_TodayTrans_WaterBender';
export const REST_URL_GET_FORECAST_WATER_BENDER = '/senselog/Get_TodayTrans_Forecast';

/**
 * HTTP methods for API requests
 * Standardized method names for consistency
 */
export const REST_METHOD_GET = 'GET';
export const REST_METHOD_POST = 'POST';
export const REST_METHOD_PUT = 'PUT';
export const REST_METHOD_DELETE = 'DELETE';

/**
 * HTTP headers
 */
export const HTTP_HEADER_VALUE_JSON = 'application/json';

// ===== DESIGN SYSTEM COLORS =====

/**
 * Primary brand colors
 * Main brand identity colors used throughout the app
 */
export const COLOR_PRIMARY = '#03AED2';           // Main brand blue - water theme
export const COLOR_PRIMARY_ACCEPT = '#009C4E';   // Success/accept actions
export const COLOR_BLUE = '#03AED2';             // Alias for primary color

/**
 * Secondary colors
 * Supporting colors for different platforms and states
 */
export const COLOR_SECONDARY_MAIN_IOS = '#FFAC1F';      // iOS secondary color
export const COLOR_SECONDARY_MAIN_ANDROID = '#FFAC1F';  // Android secondary color  
export const COLOR_MAIN_SECONDARY = '#DD5746';          // Accent/warning color
export const COLOR_SECONDARY_SUB = '#FFF3E9';           // Light secondary background

/**
 * Status and feedback colors
 * Colors for different states and user feedback
 */
export const COLOR_ERROR = '#B00020';            // Error messages and states
export const COLOR_RED = '#A91D3A';              // Critical alerts and validation errors

/**
 * Neutral colors
 * Base colors for text, backgrounds, and UI elements
 */
export const COLOR_WHITE = '#FFFFFF';            // Pure white
export const COLOR_BLACK = '#000000';            // Pure black
export const COLOR_MEDIUM_BLACK = '#2C3333';     // Dark gray for text
export const COLOR_DISABLED = '#A4A4A4';         // Disabled state color

/**
 * Gray scale palette
 * Various shades of gray for different UI needs
 */
export const COLOR_GRAY_1 = '#D8D8E0';           // Light gray
export const COLOR_GRAY_2 = '#636363';           // Medium gray

/**
 * Transparent color variants
 * Semi-transparent colors for overlays and subtle effects
 */
export const COLOR_TRANSPARENT_DARK = 'rgba(0, 0, 0, 0.15)';        // Dark overlay
export const COLOR_HORIZONTAL_LINE = '#E5E5E5';                     // Separator lines
export const COLOR_TRANSPARENT_DISABLED = '#F5F4F7';                // Disabled backgrounds
export const COLOR_TRANSPARENT_PRIMARY = 'rgba(0,156,78, 0.1)';     // Primary with opacity
export const COLOR_TRANSPARENT_SECONDARY = 'rgba(255,172,31, 0.1)'; // Secondary with opacity

/**
 * Special status colors
 */
export const STATUS_TRANSPARENT = 'transparent'; // Fully transparent

// ===== TYPOGRAPHY SYSTEM =====

/**
 * Font size scale
 * Consistent typography scale following design system principles
 * Based on 14px base size with modular scale
 */

/**
 * Large text sizes
 * For headings and prominent text
 */
export const FONT_SIZE_PAGE_TITLE = 24;      // Main page titles
export const FONT_SIZE_H1 = 24;              // Primary headings
export const FONT_SIZE_H2 = 22;              // Secondary headings  
export const FONT_SIZE_H3 = 20;              // Tertiary headings
export const FONT_SIZE_H4 = 18;              // Minor headings

/**
 * Medium text sizes
 * For body content and interactive elements
 */
export const FONT_SIZE_SECTION_TITLE = 16;   // Section headers
export const FONT_SIZE_BODY_TITLE = 16;      // Important body text
export const FONT_SIZE_BODY_LARGE = 16;      // Large body text
export const FONT_SIZE_TEXTINPUT = 16;       // Form inputs
export const FONT_SIZE_BODY = 14;            // Standard body text
export const FONT_SIZE_BUTTON = 14;          // Button labels

/**
 * Small text sizes  
 * For secondary information and captions
 */
export const FONT_SIZE_BODY_SMALL = 12;          // Small body text
export const FONT_SIZE_BODY_EXTRA_SMALL = 11;    // Tiny text and captions

/**
 * Special purpose sizes
 */
export const FONT_SIZE_PIN = 30;             // PIN input display

// ===== USAGE GUIDELINES =====

/**
 * Color Usage Guidelines:
 * 
 * PRIMARY COLORS:
 * - COLOR_PRIMARY: Main action buttons, active states, links
 * - COLOR_PRIMARY_ACCEPT: Success messages, completed states
 * 
 * SECONDARY COLORS:
 * - COLOR_MAIN_SECONDARY: Warning states, important highlights
 * - Use platform-specific secondary colors for platform consistency
 * 
 * FEEDBACK COLORS:
 * - COLOR_ERROR/COLOR_RED: Error states, validation failures
 * - Always pair with descriptive text
 * 
 * NEUTRAL COLORS:
 * - COLOR_BLACK/COLOR_MEDIUM_BLACK: Primary text
 * - COLOR_DISABLED: Inactive elements, placeholder text
 * - COLOR_GRAY_*: Secondary text, dividers
 * 
 * Font Size Guidelines:
 * 
 * HIERARCHY:
 * - Use H1-H4 for content hierarchy
 * - BODY sizes for readable content
 * - SMALL sizes for secondary information
 * 
 * ACCESSIBILITY:
 * - Minimum 12px for readable text
 * - 14px recommended for body text
 * - 16px+ for interactive elements
 */