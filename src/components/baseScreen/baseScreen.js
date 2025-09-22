/**
 * BaseScreen Component
 * 
 * A foundational wrapper component that provides consistent screen layout,
 * status bar management, and safe area handling across the application.
 * 
 * Features:
 * - Automatic safe area handling
 * - Configurable status bar appearance
 * - Optional ScrollView container
 * - Consistent styling and spacing
 * 
 * @component
 * @example
 * // Basic usage
 * <BaseScreen>
 *   <Text>Screen content here</Text>
 * </BaseScreen>
 * 
 * // With scroll view
 * <BaseScreen useScrollViewContainer>
 *   <LongContentList />
 * </BaseScreen>
 * 
 * // Custom styling
 * <BaseScreen 
 *   containerStyle={{ backgroundColor: COLOR_PRIMARY }}
 *   statusBarColor={COLOR_WHITE}
 *   translucent
 * >
 *   <Content />
 * </BaseScreen>
 */

import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLOR_WHITE } from '../../tools/constant';

/**
 * BaseScreen Props Interface
 * @typedef {Object} BaseScreenProps
 * @property {React.ReactNode} children - Child components to render
 * @property {Object} containerStyle - Custom styles for the main container
 * @property {Object} contentStyle - Custom styles for the content wrapper
 * @property {string} barBackgroundColor - Status bar background color
 * @property {boolean} translucent - Whether status bar should be translucent
 * @property {string} statusBarColor - Color for status bar text/icons
 * @property {boolean} hiddenBar - Whether to hide the status bar
 * @property {boolean} useScrollViewContainer - Whether to wrap content in ScrollView
 * @property {...Object} props - Additional props passed to ScrollView (if enabled)
 */

const BaseScreen = ({
  children, 
  containerStyle, 
  contentStyle, 
  barBackgroundColor, 
  translucent,
  statusBarColor, 
  hiddenBar, 
  useScrollViewContainer = false, 
  ...props
}) => {
  // Determine status bar style based on background color
  const getStatusBarStyle = () => {
    return statusBarColor === COLOR_WHITE ? 'light-content' : 'dark-content';
  };

  // Render content wrapper based on scroll configuration
  const renderContent = () => {
    if (useScrollViewContainer) {
      return (
        <ScrollView
          style={[styles.contentWrapper, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          {...props}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={[styles.contentWrapper, contentStyle]}>
        {children}
      </View>
    );
  };

  return (
    <SafeAreaProvider style={[styles.container, containerStyle]}>
      {/* Status bar configuration */}
      <StatusBar
        hidden={hiddenBar}
        translucent={translucent}
        backgroundColor={barBackgroundColor}
        barStyle={getStatusBarStyle()}
      />
      
      {/* Main content area */}
      {renderContent()}
    </SafeAreaProvider>
  );
};

// ===== STYLES =====
const styles = {
  container: {
    backgroundColor: COLOR_WHITE,
    flex: 1,
    paddingVertical: 25,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
  }
};

// ===== PROP DEFAULTS =====
BaseScreen.defaultProps = {
  useScrollViewContainer: false,
  translucent: false,
  hiddenBar: false,
};

export default BaseScreen;

