/**
 * Splash Screen Module Export
 * 
 * Entry point for the splash screen feature module.
 * Exports the Redux-connected splash screen component for use in navigation.
 * 
 * Features:
 * - Redux state integration for authentication checking
 * - Automatic navigation based on user session status
 * - Clean separation of concerns with proper module structure
 * 
 * Usage:
 * ```javascript
 * import SplashScreen from './screens/splash';
 * // Component will handle authentication check and navigation automatically
 * ```
 * 
 * @file src/screens/splash/index.js
 * @version 1.0.0
 */

import SplashScreen from "./ReduxConnext";

export default SplashScreen;