/**
 * Button Component
 * 
 * A versatile button component that handles different states including
 * enabled, disabled, and loading states with consistent styling.
 * 
 * Features:
 * - Three distinct states: enabled, disabled, loading
 * - Customizable styling for container and text
 * - Automatic state management
 * - Consistent design system integration
 * 
 * @component
 * @example
 * // Basic button
 * <Button caption="Submit" onPress={handleSubmit} />
 * 
 * // Disabled button
 * <Button caption="Submit" disabled onPress={handleSubmit} />
 * 
 * // Loading button
 * <Button caption="Submit" loading onPress={handleSubmit} />
 * 
 * // Custom styled button
 * <Button 
 *   caption="Custom Button"
 *   containerStyle={{ backgroundColor: COLOR_SECONDARY }}
 *   textStyle={{ fontSize: 18 }}
 *   onPress={handlePress}
 * />
 */

import React from 'react';
import {
    TouchableOpacity, 
    Text, 
    View, 
    ActivityIndicator,
} from 'react-native';
import {
    COLOR_DISABLED, 
    COLOR_MAIN_SECONDARY, 
    COLOR_WHITE,
} from '../../tools/constant';

/**
 * Button Props Interface
 * @typedef {Object} ButtonProps
 * @property {boolean} disabled - Whether the button is disabled
 * @property {boolean} loading - Whether the button is in loading state
 * @property {string} caption - Text to display on the button
 * @property {Object} containerStyle - Custom styles for button container
 * @property {Object} textStyle - Custom styles for button text
 * @property {Function} onPress - Function to call when button is pressed
 */

// ===== COMPONENT STYLES =====
const styles = {
    buttonContainer: {
        backgroundColor: COLOR_MAIN_SECONDARY,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        height: 45,
        paddingHorizontal: 25,
    },
    disabledContainer: {
        backgroundColor: COLOR_DISABLED,
    },
    textStyle: {
        color: COLOR_WHITE,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
};

// ===== BUTTON STATE RENDERERS =====

/**
 * Renders an enabled, interactive button
 */
const renderEnabledButton = (caption, containerStyle, textStyle, onPress) => (
    <TouchableOpacity 
        style={[styles.buttonContainer, containerStyle]} 
        onPress={onPress}
        activeOpacity={0.8}
    >
        <Text style={[styles.textStyle, textStyle]}>
            {caption}
        </Text>
    </TouchableOpacity>
);

/**
 * Renders a disabled, non-interactive button
 */
const renderDisabledButton = (caption, containerStyle, textStyle) => (
    <View style={[styles.buttonContainer, styles.disabledContainer, containerStyle]}>
        <Text style={[styles.textStyle, textStyle]}>
            {caption}
        </Text>
    </View>
);

/**
 * Renders a loading button with activity indicator
 */
const renderLoadingButton = (containerStyle) => (
    <View style={[styles.buttonContainer, containerStyle]}>
        <ActivityIndicator 
            size="large" 
            color={COLOR_WHITE} 
            testID="button-loading-indicator"
        />
    </View>
);

// ===== MAIN COMPONENT =====

/**
 * Main Button Component
 * Handles different button states and renders appropriate UI
 */
const Button = ({
    disabled = false, 
    loading = false, 
    caption = 'Button', 
    containerStyle = {}, 
    textStyle = {}, 
    onPress = () => {},
}) => {
    // Validate required props
    if (!caption && !loading) {
        console.warn('Button: caption prop is required when not in loading state');
    }

    // Render based on current state
    if (loading) {
        return renderLoadingButton(containerStyle);
    }
    
    if (disabled) {
        return renderDisabledButton(caption, containerStyle, textStyle);
    }
    
    return renderEnabledButton(caption, containerStyle, textStyle, onPress);
};

// ===== PROP DEFAULTS =====
Button.defaultProps = {
    disabled: false,
    loading: false,
    caption: 'Button',
    containerStyle: {},
    textStyle: {},
    onPress: () => {},
};

export default Button;
