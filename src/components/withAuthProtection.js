/**
 * Authentication Protection HOC (Higher-Order Component)
 * 
 * Provides authentication-based route protection for React Native screens.
 * Automatically redirects unauthenticated users to login screen and provides
 * loading state during authentication verification.
 * 
 * Features:
 * - Automatic redirect for unauthenticated users
 * - Loading state during auth verification
 * - Redux integration for authentication state
 * - Configurable redirect behavior
 * - Development-friendly logging
 * 
 * Usage:
 * ```javascript
 * import withAuthProtection from '../components/withAuthProtection';
 * 
 * const ProtectedDashboard = withAuthProtection(DashboardScreen, {
 *   redirectTo: 'LOGIN',
 *   showLoading: true
 * });
 * ```
 * 
 * @file src/components/withAuthProtection.js
 * @version 1.0.0
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../redux/features/login/loginSlice';
import NavigationService from '../tools/navigationService';
import { NAV_NAME_LOGIN } from '../tools/constant';
import { COLOR_PRIMARY, COLOR_WHITE, COLOR_GRAY_1 } from '../tools/constant';

// ===== CONFIGURATION =====

/**
 * Default configuration for auth protection
 */
const DEFAULT_CONFIG = {
    redirectTo: NAV_NAME_LOGIN,
    showLoading: true,
    loadingTimeout: 3000,
    requireUserData: true,
};

// ===== LOADING COMPONENT =====

/**
 * Authentication loading screen component
 * Displays while verifying authentication status
 */
const AuthLoadingScreen = ({ message = 'Verifying authentication...' }) => (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLOR_PRIMARY} />
        <Text style={styles.loadingText}>{message}</Text>
    </View>
);

// ===== MAIN HOC =====

/**
 * Create authentication protection HOC
 * 
 * @param {React.Component} WrappedComponent - Component to protect
 * @param {Object} config - Protection configuration
 * @param {string} config.redirectTo - Route to redirect if not authenticated
 * @param {boolean} config.showLoading - Show loading during auth check
 * @param {number} config.loadingTimeout - Max time to show loading
 * @param {boolean} config.requireUserData - Require user data in addition to auth flag
 * @returns {React.Component} Protected component
 */
const withAuthProtection = (WrappedComponent, config = {}) => {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    
    /**
     * Protected component with authentication logic
     */
    const ProtectedComponent = (props) => {
        const { isAuthenticated, currentUser, ...otherProps } = props;
        const [isVerifying, setIsVerifying] = useState(true);
        const [hasRedirected, setHasRedirected] = useState(false);
        
        /**
         * Check authentication status and handle redirects
         */
        useEffect(() => {
            const verifyAuthentication = async () => {
                console.log('🔒 Auth Protection Check:', {
                    isAuthenticated,
                    hasUser: !!currentUser,
                    requireUserData: finalConfig.requireUserData
                });
                
                // Determine if user is properly authenticated
                const isProperlyAuthenticated = finalConfig.requireUserData 
                    ? isAuthenticated && currentUser
                    : isAuthenticated;
                
                if (!isProperlyAuthenticated && !hasRedirected) {
                    console.log('❌ Authentication failed, redirecting to:', finalConfig.redirectTo);
                    setHasRedirected(true);
                    
                    // Small delay to prevent navigation conflicts
                    setTimeout(() => {
                        NavigationService.reset(finalConfig.redirectTo);
                    }, 100);
                    
                    return;
                }
                
                if (isProperlyAuthenticated) {
                    console.log('✅ Authentication verified, showing protected content');
                    setIsVerifying(false);
                }
            };
            
            // Add timeout to prevent infinite loading
            const timeoutId = setTimeout(() => {
                if (isVerifying) {
                    console.log('⏰ Auth verification timeout, proceeding...');
                    setIsVerifying(false);
                }
            }, finalConfig.loadingTimeout);
            
            verifyAuthentication();
            
            return () => clearTimeout(timeoutId);
        }, [isAuthenticated, currentUser, hasRedirected]);
        
        // Show loading if still verifying and configured to show loading
        if (isVerifying && finalConfig.showLoading) {
            return <AuthLoadingScreen message="Verifying authentication..." />;
        }
        
        // Don't render if not authenticated (will redirect)
        if (!isAuthenticated || (finalConfig.requireUserData && !currentUser)) {
            return null;
        }
        
        // Render protected component with all props
        return (
            <WrappedComponent 
                {...otherProps}
                isAuthenticated={isAuthenticated}
                currentUser={currentUser}
            />
        );
    };
    
    /**
     * Connect protected component to Redux state
     */
    const mapStateToProps = (state) => ({
        isAuthenticated: selectIsAuthenticated(state),
        currentUser: selectCurrentUser(state),
    });
    
    const ConnectedProtectedComponent = connect(mapStateToProps)(ProtectedComponent);
    
    // Set display name for debugging
    ConnectedProtectedComponent.displayName = `withAuthProtection(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    
    return ConnectedProtectedComponent;
};

// ===== CONVENIENCE EXPORTS =====

/**
 * Pre-configured HOC for dashboard protection
 */
export const withDashboardProtection = (Component) => 
    withAuthProtection(Component, {
        redirectTo: NAV_NAME_LOGIN,
        showLoading: true,
        requireUserData: true,
    });

/**
 * Pre-configured HOC for basic auth protection
 */
export const withBasicAuthProtection = (Component) =>
    withAuthProtection(Component, {
        redirectTo: NAV_NAME_LOGIN,
        showLoading: false,
        requireUserData: false,
    });

// ===== STYLES =====

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_WHITE,
        paddingHorizontal: 20,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: COLOR_GRAY_1,
        textAlign: 'center',
        fontWeight: '500',
    },
});

// ===== EXPORTS =====

export default withAuthProtection;

/**
 * Utility function to create custom auth protection
 */
export const createAuthProtection = (customConfig) => (Component) =>
    withAuthProtection(Component, customConfig);
