/**
 * KeyboardView Component
 * 
 * A wrapper component around KeyboardAwareScrollView that provides
 * automatic keyboard handling for forms and scrollable content.
 * Automatically adjusts scroll position when keyboard appears.
 * 
 * Features:
 * - Automatic keyboard avoidance
 * - Smooth scrolling animations
 * - Configurable scroll behavior
 * - Hidden vertical scroll indicators by default
 * - Pass-through props support
 * 
 * @component
 * @example
 * // Basic usage
 * <KeyboardView>
 *   <FormContent />
 * </KeyboardView>
 * 
 * // With custom props
 * <KeyboardView 
 *   enableAutomaticScroll={true}
 *   extraScrollHeight={20}
 *   keyboardShouldPersistTaps="handled"
 * >
 *   <InputForm />
 * </KeyboardView>
 * 
 * // With custom styling
 * <KeyboardView 
 *   contentContainerStyle={{ padding: 20 }}
 *   showsVerticalScrollIndicator={true}
 * >
 *   <LongForm />
 * </KeyboardView>
 */

import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

/**
 * KeyboardView Props Interface
 * @typedef {Object} KeyboardViewProps
 * @property {React.ReactNode} children - Content to be rendered inside the scroll view
 * @property {boolean} showsVerticalScrollIndicator - Whether to show vertical scroll indicator
 * @property {boolean} enableAutomaticScroll - Whether to enable automatic scrolling to focused inputs
 * @property {number} extraScrollHeight - Additional scroll height when keyboard appears
 * @property {string} keyboardShouldPersistTaps - How taps should be handled when keyboard is visible
 * @property {Object} contentContainerStyle - Style object for the content container
 * @property {...Object} props - Additional props passed to KeyboardAwareScrollView
 */

// ===== MAIN COMPONENT =====

/**
 * KeyboardView Component
 * Wraps content in a keyboard-aware scroll view with sensible defaults
 */
const KeyboardView = ({ 
    children, 
    showsVerticalScrollIndicator = false,
    enableAutomaticScroll = true,
    extraScrollHeight = 20,
    keyboardShouldPersistTaps = 'handled',
    ...props 
}) => {
    // Validate required props
    if (!children) {
        console.warn('KeyboardView: children prop is required');
        return null;
    }

    return (
        <KeyboardAwareScrollView
            // Default behavior
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            enableAutomaticScroll={enableAutomaticScroll}
            extraScrollHeight={extraScrollHeight}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            
            // Performance optimizations
            removeClippedSubviews={true}
            keyboardDismissMode="interactive"
            
            // Accessibility
            accessible={true}
            accessibilityRole="scrollbar"
            
            // Test ID for testing
            testID="keyboard-aware-scroll-view"
            
            // Pass through additional props
            {...props}
        >
            {children}
        </KeyboardAwareScrollView>
    );
};

// ===== PROP TYPES =====
KeyboardView.propTypes = {
    children: PropTypes.node.isRequired,
    showsVerticalScrollIndicator: PropTypes.bool,
    enableAutomaticScroll: PropTypes.bool,
    extraScrollHeight: PropTypes.number,
    keyboardShouldPersistTaps: PropTypes.oneOf(['always', 'never', 'handled']),
};

// ===== DEFAULT PROPS =====
KeyboardView.defaultProps = {
    showsVerticalScrollIndicator: false,
    enableAutomaticScroll: true,
    extraScrollHeight: 20,
    keyboardShouldPersistTaps: 'handled',
};

export default KeyboardView;
