/**
 * Header Component (Page Header)
 * 
 * A reusable header component that provides consistent navigation and branding
 * across the application screens. Supports back navigation, custom titles,
 * and configurable right-side actions.
 * 
 * Features:
 * - Responsive design for different screen sizes
 * - Optional back button with navigation
 * - Customizable right-side action button
 * - Consistent styling and spacing
 * - PropTypes validation for type safety
 * 
 * @component
 * @example
 * // Basic header with title
 * <MyHeader pageTitle="Dashboard" />
 * 
 * // Header with back button
 * <MyHeader 
 *   pageTitle="Profile" 
 *   backButton 
 *   onBackPressed={() => navigation.goBack()}
 * />
 * 
 * // Header with right action button
 * <MyHeader 
 *   pageTitle="Settings"
 *   rightButton
 *   iconType={iconTools.MaterialCommunityIcons}
 *   iconName="cog"
 *   onRightPressed={openSettings}
 * />
 */

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

// Internal imports
import NavigationService from '../../tools/navigationService';
import { H3 } from '../labels/Labels';
import { 
    COLOR_DISABLED, 
    COLOR_PRIMARY, 
    COLOR_WHITE 
} from '../../tools/constant';
import { iPad, iconTools, ios } from "../../tools/helper";

// ===== COMPONENT STYLES =====
const styles = {
    container: {
        height: iPad ? 70 : ios ? 60 : 50,
        width: '100%',
        backgroundColor: COLOR_PRIMARY,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: COLOR_DISABLED,
        position: 'relative',
    },
    backButton: {
        marginLeft: 10,
        position: 'absolute',
        zIndex: 9,
        padding: 8, // Added padding for better touch target
    },
    rightButton: {
        right: 15,
        position: 'absolute',
        zIndex: 9,
        padding: 8, // Added padding for better touch target
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
};

// ===== COMPONENT RENDERERS =====

/**
 * Renders the back navigation button if enabled
 * @param {boolean} backButton - Whether to show back button
 * @param {Function} onBackPressed - Callback for back button press
 * @returns {React.ReactElement|null} Back button component or null
 */
const renderBackButton = (backButton, onBackPressed) => {
    if (!backButton) return null;

    return (
        <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPressed}
            activeOpacity={0.7}
            testID="header-back-button"
        >
            <iconTools.MaterialCommunityIcons
                name={'arrow-left'}
                color={COLOR_WHITE}
                size={24}
            />
        </TouchableOpacity>
    );
};

/**
 * Renders the right-side action button if configured
 * @param {boolean} rightButton - Whether to show right button
 * @param {Function} onRightPressed - Callback for right button press
 * @param {React.ComponentType} iconType - Icon component type
 * @param {string} iconName - Icon name/identifier
 * @returns {React.ReactElement|null} Right button component or null
 */
const renderRightButton = (rightButton, onRightPressed, iconType, iconName) => {
    if (!rightButton || !iconType || !iconName) return null;

    const IconComponent = iconType;

    return (
        <TouchableOpacity
            style={styles.rightButton}
            onPress={onRightPressed}
            activeOpacity={0.7}
            testID="header-right-button"
        >
            <IconComponent
                name={iconName}
                color={COLOR_WHITE}
                size={28}
            />
        </TouchableOpacity>
    );
};

/**
 * Renders the header title
 * @param {string} pageTitle - Title text to display
 * @param {number} fontSize - Custom font size for title
 * @returns {React.ReactElement} Title component
 */
const renderTitle = (pageTitle, fontSize) => (
    <View style={styles.titleContainer}>
        <H3
            style={{
                color: COLOR_WHITE,
                fontWeight: 'bold',
                fontSize: fontSize || 20,
                textAlign: 'center',
            }}
            testID="header-title"
        >
            {pageTitle}
        </H3>
    </View>
);

// ===== MAIN COMPONENT =====

/**
 * Main Header Component
 * @param {Object} props - Component props
 * @returns {React.ReactElement} Header component
 */
const PageHeader = ({
    pageTitle,
    backButton,
    onBackPressed,
    onRightPressed,
    customHeader,
    fontSize,
    iconType,
    iconName,
    rightButton
}) => {
    // Validate required props
    if (!pageTitle) {
        console.warn('PageHeader: pageTitle prop is required');
    }

    if (rightButton && (!iconType || !iconName)) {
        console.warn('PageHeader: iconType and iconName are required when rightButton is true');
    }

    return (
        <View style={[styles.container, customHeader]}>
            {renderBackButton(backButton, onBackPressed)}
            {renderTitle(pageTitle, fontSize)}
            {renderRightButton(rightButton, onRightPressed, iconType, iconName)}
        </View>
    );
};

// ===== PROP TYPES =====
PageHeader.propTypes = {
    pageTitle: PropTypes.string.isRequired,
    backButton: PropTypes.bool,
    rightButton: PropTypes.bool,
    onBackPressed: PropTypes.func,
    onRightPressed: PropTypes.func,
    customHeader: PropTypes.object,
    fontSize: PropTypes.number,
    iconType: PropTypes.elementType,
    iconName: PropTypes.string,
};

// ===== DEFAULT PROPS =====
PageHeader.defaultProps = {
    backButton: false,
    rightButton: false,
    onBackPressed: () => NavigationService.back(),
    onRightPressed: () => {},
    customHeader: {},
    fontSize: 20,
};

export default PageHeader;
