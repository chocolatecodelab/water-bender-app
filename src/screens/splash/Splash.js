/**
 * Splash Screen Component
 * 
 * Initial loading screen that displays the application logo while
 * performing authentication checks and determining navigation flow.
 * Serves as the entry point for user session validation.
 * 
 * Features:
 * - Application logo display with responsive design
 * - Authentication status validation on startup
 * - Automatic navigation routing based on user session
 * - Firebase messaging permissions setup (optional)
 * - Clean, professional loading experience
 * 
 * Flow:
 * 1. Display logo and branding
 * 2. Check user authentication status from Redux store
 * 3. Navigate to appropriate screen (Dashboard/Login)
 * 4. Handle edge cases and loading states gracefully
 * 
 * @file src/screens/splash/Splash.js
 * @version 1.0.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { 
    StyleSheet, 
    Image, 
    View, 
    Text,
    ActivityIndicator,
    Dimensions 
} from 'react-native';
import { BaseScreen } from '../../components';
import { COLOR_WHITE, COLOR_PRIMARY, COLOR_GRAY_1 } from '../../tools/constant';

// ===== CONSTANTS =====

/**
 * Splash screen configuration constants
 */
const SPLASH_CONFIG = {
    DISPLAY_DURATION: 500,        // Minimum splash display time (ms)
    NAVIGATION_TIMEOUT: 3000,     // Maximum time before fallback navigation
    LOGO_ANIMATION_DURATION: 800, // Logo fade-in animation duration
    DEBUG_MODE: __DEV__,          // Enable debug logging in development
};

/**
 * Get responsive dimensions for different screen sizes
 */
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth > 768;
const isSmallScreen = screenHeight < 600;

// ===== HELPER FUNCTIONS =====

/**
 * Log splash screen events for debugging
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
const logSplashEvent = (event, data = {}) => {
    if (SPLASH_CONFIG.DEBUG_MODE) {
        console.log(`🎬 Splash Screen - ${event}:`, {
            timestamp: new Date().toISOString(),
            ...data
        });
    }
};

// ===== MAIN COMPONENT =====

/**
 * Splash Screen Component
 * 
 * @param {Object} props - Component properties
 * @param {boolean} props.isAuthenticated - User authentication status
 * @param {Object|null} props.currentUser - Current user data
 * @param {boolean} props.hasValidSession - Combined authentication validation
 * @param {Function} props.onAppear - Navigation handler function
 * @param {Function} props.onTimeout - Timeout fallback handler
 * @param {Object} props.debugAuthState - Debug authentication state (dev only)
 */
const SplashScreen = ({ 
    isAuthenticated, 
    currentUser, 
    hasValidSession,
    onAppear, 
    onTimeout,
    debugAuthState 
}) => {
    // ===== STATE MANAGEMENT =====
    
    const [isLoading, setIsLoading] = useState(true);
    const [hasNavigated, setHasNavigated] = useState(false);
    
    // ===== AUTHENTICATION & NAVIGATION LOGIC =====
    
    /**
     * Handle splash screen appearance and authentication validation
     * Uses useCallback to prevent unnecessary re-renders and ensure
     * navigation only happens once.
     */
    const handleSplashAppearance = useCallback(() => {
        if (hasNavigated) {
            logSplashEvent('Navigation Already Completed', { 
                hasNavigated: true 
            });
            return;
        }
        
        logSplashEvent('Splash Screen Appeared', {
            isAuthenticated,
            hasUser: !!currentUser,
            hasValidSession,
            screenDimensions: { width: screenWidth, height: screenHeight },
            deviceType: isTablet ? 'tablet' : 'phone'
        });
        
        // Set minimum display time for better UX
        const navigationTimer = setTimeout(() => {
            if (!hasNavigated) {
                setHasNavigated(true);
                setIsLoading(false);
                
                logSplashEvent('Triggering Navigation', {
                    after: SPLASH_CONFIG.DISPLAY_DURATION,
                    isAuthenticated,
                    hasValidSession
                });
                
                // Trigger navigation with proper parameters
                onAppear(isAuthenticated, currentUser, hasValidSession);
            }
        }, SPLASH_CONFIG.DISPLAY_DURATION);
        
        // Cleanup function to clear timer
        return () => {
            clearTimeout(navigationTimer);
        };
    }, [isAuthenticated, currentUser, hasValidSession, hasNavigated, onAppear]);
    
    // ===== LIFECYCLE MANAGEMENT =====
    
    /**
     * Initialize splash screen on component mount
     */
    useEffect(() => {
        logSplashEvent('Component Mounted', {
            authenticationState: {
                isAuthenticated,
                hasUser: !!currentUser,
                username: currentUser?.username || 'none'
            }
        });
        
        // Start splash screen flow
        const cleanup = handleSplashAppearance();
        
        // Setup fallback timeout to prevent infinite loading
        const fallbackTimer = setTimeout(() => {
            if (!hasNavigated) {
                logSplashEvent('Fallback Timeout Triggered', {
                    after: SPLASH_CONFIG.NAVIGATION_TIMEOUT
                });
                setHasNavigated(true);
                onTimeout?.();
            }
        }, SPLASH_CONFIG.NAVIGATION_TIMEOUT);
        
        // Cleanup function
        return () => {
            cleanup?.();
            clearTimeout(fallbackTimer);
        };
    }, []); // Empty dependency array for mount-only effect
    
    /**
     * Handle Firebase messaging permissions (optional feature)
     * Commented out but ready to be enabled when Firebase is configured
     */
    useEffect(() => {
        // Firebase messaging setup would go here
        // Currently disabled as indicated by commented code
        
        if (SPLASH_CONFIG.DEBUG_MODE) {
            logSplashEvent('Firebase Messaging Setup', {
                status: 'disabled',
                note: 'Enable when Firebase is configured'
            });
        }
    }, []);
    
    // ===== RENDER COMPONENT =====
    
    return (
        <BaseScreen 
            barBackgroundColor={COLOR_WHITE} 
            contentStyle={styles.baseScreenContent}
        >
            <View style={styles.container}>
                {/* Main Logo Display */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        resizeMode="contain"
                        style={styles.logo}
                        onLoad={() => logSplashEvent('Logo Loaded Successfully')}
                        onError={() => logSplashEvent('Logo Load Error')}
                    />
                </View>
                
                {/* Loading Indicator */}
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator 
                            size="small" 
                            color={COLOR_PRIMARY} 
                            style={styles.loadingIndicator}
                        />
                        <Text style={styles.loadingText}>
                            Preparing your experience...
                        </Text>
                    </View>
                )}
                
                {/* Debug Information (Development Only) */}
                {SPLASH_CONFIG.DEBUG_MODE && debugAuthState && (
                    <View style={styles.debugContainer}>
                        <Text style={styles.debugText}>
                            Auth: {isAuthenticated ? '✅' : '❌'} | 
                            User: {currentUser ? '👤' : '👻'} |
                            Session: {hasValidSession ? '🔐' : '🔓'}
                        </Text>
                    </View>
                )}
            </View>
        </BaseScreen>
    );
};

// ===== COMPONENT STYLES =====

/**
 * Responsive styles for splash screen component
 * Adapts to different screen sizes and device types
 */
const styles = StyleSheet.create({
    // Base screen configuration
    baseScreenContent: {
        paddingHorizontal: 20,
        backgroundColor: COLOR_WHITE,
    },
    
    // Main container
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_WHITE,
        width: '100%',
        height: '100%',
    },
    
    // Logo container and styling
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    
    logo: {
        height: isSmallScreen ? 350 : isTablet ? 500 : 450,
        width: isSmallScreen ? 500 : isTablet ? 700 : 600,
        maxWidth: screenWidth * 0.9,
        maxHeight: screenHeight * 0.6,
    },
    
    // Loading indicator styling
    loadingContainer: {
        position: 'absolute',
        bottom: screenHeight * 0.15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    loadingIndicator: {
        marginBottom: 12,
    },
    
    loadingText: {
        fontSize: 14,
        color: COLOR_GRAY_1,
        fontWeight: '500',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    
    // Debug information styling (development only)
    debugContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 8,
        borderRadius: 4,
        opacity: 0.7,
    },
    
    debugText: {
        fontSize: 10,
        color: COLOR_GRAY_1,
        textAlign: 'center',
        fontFamily: 'monospace',
    },
});

// ===== EXPORT =====

export default SplashScreen;