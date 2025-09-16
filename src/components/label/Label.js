/**
 * Label Component
 * 
 * A foundational text component that provides consistent typography
 * and styling across the application. Serves as the base for all
 * text-related components with customizable formatting options.
 * 
 * Features:
 * - Configurable font size, weight, and style
 * - Text decoration support (underline)
 * - Consistent color theming
 * - Font scaling disabled for UI consistency
 * - Extensible styling through props
 * 
 * @component
 * @example
 * // Basic label
 * <Label>Simple text content</Label>
 * 
 * // Bold label with custom size
 * <Label fontSize={18} bold>Important text</Label>
 * 
 * // Styled label with custom color
 * <Label 
 *   fontSize={16} 
 *   italic 
 *   underline 
 *   style={{ color: COLOR_PRIMARY }}
 * >
 *   Styled text content
 * </Label>
 */

import React from 'react';
import { Text } from 'react-native';
import { COLOR_BLACK } from '../../tools/constant';

/**
 * Label Props Interface
 * @typedef {Object} LabelProps
 * @property {number} fontSize - Font size in pixels
 * @property {boolean} bold - Whether text should be bold
 * @property {boolean} italic - Whether text should be italic
 * @property {boolean} underline - Whether text should be underlined
 * @property {Object} style - Additional custom styles
 * @property {React.ReactNode} children - Text content to display
 */

// ===== COMPONENT STYLES =====
const styles = {
    textStyle: {
        color: COLOR_BLACK,
        fontFamily: 'System', // Use system font for better performance
    },
};

// ===== STYLE GENERATORS =====

/**
 * Generates font weight style based on bold prop
 * @param {boolean} bold - Whether text should be bold
 * @returns {Object} Font weight style object
 */
const getFontWeight = (bold) => ({
    fontWeight: bold ? 'bold' : 'normal'
});

/**
 * Generates font style based on italic prop
 * @param {boolean} italic - Whether text should be italic
 * @returns {Object} Font style object
 */
const getFontStyle = (italic) => ({
    fontStyle: italic ? 'italic' : 'normal'
});

/**
 * Generates text decoration style based on underline prop
 * @param {boolean} underline - Whether text should be underlined
 * @returns {Object} Text decoration style object
 */
const getTextDecoration = (underline) => ({
    textDecorationLine: underline ? 'underline' : 'none'
});

/**
 * Generates font size style if fontSize prop is provided
 * @param {number} fontSize - Font size in pixels
 * @returns {Object} Font size style object
 */
const getFontSize = (fontSize) => {
    return fontSize ? { fontSize } : {};
};

// ===== MAIN COMPONENT =====

/**
 * Main Label Component
 * Renders text with consistent styling and customizable formatting
 */
const Label = ({
    fontSize,
    bold = false,
    italic = false,
    underline = false,
    style = {},
    children,
    ...textProps
}) => {
    // Validate children prop
    if (!children && children !== 0) {
        console.warn('Label: children prop is required');
        return null;
    }

    // Compose all style objects
    const composedStyles = [
        styles.textStyle,
        getFontSize(fontSize),
        getFontWeight(bold),
        getFontStyle(italic),
        getTextDecoration(underline),
        style, // Custom styles applied last for override capability
    ];

    return (
        <Text
            style={composedStyles}
            allowFontScaling={false} // Prevents accessibility font scaling issues
            testID="label-text"
            {...textProps}
        >
            {children}
        </Text>
    );
};

// ===== DEFAULT PROPS =====
Label.defaultProps = {
    bold: false,
    italic: false,
    underline: false,
    style: {},
};

export default Label;

