/**
 * Hooks Export Index
 * 
 * This file serves as the central export point for all custom hooks
 * in the application. It provides reusable hook logic for state management,
 * data processing, and UI interactions.
 * 
 * @file src/hooks/index.js
 * @version 1.0.0
 */

// ===== UI & STATE MANAGEMENT HOOKS =====
export { default as useDateSelection } from './useDateSelection';
export { default as useModalManagement } from './useModalManagement';
export { default as useResponsiveLayout } from './useResponsiveLayout';
export { default as useRefreshControl } from './useRefreshControl';

// ===== DATA PROCESSING HOOKS =====
export { default as useChartData } from './useChartData';

/**
 * Usage Examples:
 * 
 * // Import specific hooks
 * import { useDateSelection, useChartData } from '@hooks';
 * 
 * // Import with destructuring
 * import { useModalManagement, useResponsiveLayout } from '@hooks';
 */