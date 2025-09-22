/**
 * Redux Store Configuration
 * 
 * Central Redux store configuration for the Water Monitoring Application.
 * Implements Redux Toolkit with persistence support for offline capabilities
 * and state rehydration across app sessions.
 * 
 * Features:
 * - Redux Toolkit for modern Redux patterns
 * - Redux Persist for offline state management
 * - AsyncStorage for React Native data persistence
 * - Thunk middleware for async operations
 * - Feature-based slice organization
 * 
 * Store Structure:
 * - auth: Authentication and user session management
 * - register: User registration workflow
 * - home: Water monitoring data and dashboard state
 * 
 * @file src/redux/store.js
 * @version 1.0.0
 */

import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { thunk } from 'redux-thunk';

// ===== FEATURE SLICE IMPORTS =====
import HomeSlice from './features/home/homeSlice';
import RegisterSlice from './features/register/registerSlice';
import AuthSlice from './features/login/loginSlice';

// ===== REDUCER CONFIGURATION =====

/**
 * Root reducer combining all feature slices
 * Each slice manages its own domain of the application state
 */
const reducers = combineReducers({
    auth: AuthSlice,           // Authentication & user session
    register: RegisterSlice,   // User registration workflow
    home: HomeSlice,          // Water monitoring data & dashboard
});

// ===== PERSISTENCE CONFIGURATION =====

/**
 * Redux Persist configuration
 * Defines which slices should be persisted to AsyncStorage
 * for offline capability and state restoration
 */
const persistConfig = {
    key: 'root',                    // Storage key identifier
    storage: AsyncStorage,          // React Native AsyncStorage
    whitelist: [                    // Slices to persist
        'home',                     // Water monitoring data
        'auth',                     // User authentication state  
        'register',                 // Registration workflow state
    ],
    // Optional: Add blacklist for sensitive data that shouldn't persist
    // blacklist: ['sensitiveData']
};

/**
 * Enhanced reducer with persistence capabilities
 * Automatically handles state rehydration on app startup
 */
const persistedReducer = persistReducer(persistConfig, reducers);

// ===== STORE CONFIGURATION =====

/**
 * Configure Redux store with persistence and middleware
 * Uses Redux Toolkit's configureStore for optimal defaults
 */
export const store = configureStore({
    reducer: persistedReducer,
    
    // Middleware configuration
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            // Disable serializable check for redux-persist actions
            serializableCheck: {
                ignoredActions: [
                    'persist/FLUSH',
                    'persist/REHYDRATE',
                    'persist/PAUSE',
                    'persist/PERSIST',
                    'persist/PURGE',
                    'persist/REGISTER',
                ],
            },
        }).concat(thunk), // Add thunk for async actions
    
    // Enable Redux DevTools in development
    devTools: __DEV__,
});

// ===== PERSISTENCE STORE =====

/**
 * Persistor instance for controlling persistence operations
 * Used to manage rehydration and purging of persisted state
 */
export const persistor = persistStore(store);

// ===== UTILITY FUNCTIONS =====

/**
 * Get current state snapshot
 * Useful for debugging and testing
 * @returns {Object} Current Redux state
 */
export const getCurrentState = () => store.getState();

/**
 * Purge all persisted data
 * Useful for logout or data reset scenarios
 * @returns {Promise<void>}
 */
export const purgePersistentData = async () => {
    try {
        await persistor.purge();
        console.log('✅ Persistent data purged successfully');
    } catch (error) {
        console.error('❌ Error purging persistent data:', error);
        throw error;
    }
};

/**
 * Pause persistence
 * Temporarily stops state persistence
 */
export const pausePersistence = () => {
    persistor.pause();
    console.log('⏸️ Persistence paused');
};

/**
 * Resume persistence
 * Resumes state persistence after being paused
 */
export const resumePersistence = () => {
    persistor.persist();
    console.log('▶️ Persistence resumed');
};

// ===== DEVELOPMENT UTILITIES =====

if (__DEV__) {
    /**
     * Development-only: Log state changes
     * Helps with debugging state mutations
     */
    store.subscribe(() => {
        const state = store.getState();
        console.log('🔄 Redux State Updated:', {
            auth: !!state.auth?.username,
            home: {
                loading: state.home?.isLoading,
                hasData: !!state.home?.waterBenderLast?.length,
            },
            register: {
                loading: state.register?.isLoading,
                success: state.register?.isSuccess,
            },
        });
    });
}

/**
 * Export default store instance
 * This is the main export used by the app
 */
export default store;
