# Tools & Utilities Documentation

## Overview

The `src/tools/` directory contains essential utility modules and services that provide core functionality across the Water Monitoring React Native application. These tools implement clean code principles with comprehensive documentation and error handling.

## Architecture

```
tools/
├── constant.js         # Application constants and design system
├── chartUtils.js       # Chart visualization utilities
├── navigationService.js # Navigation service layer
├── helper.js          # General utility functions
├── localization.js    # Internationalization support
└── README.md          # This documentation
```

## 📁 **File Documentation**

### 🎨 `constant.js` - Application Constants

**Purpose**: Central repository for all application-wide constants including navigation, API endpoints, colors, and typography.

#### Key Features:
- **Navigation Routes**: Centralized route name definitions
- **API Configuration**: Base URLs and endpoint templates
- **Design System**: Complete color palette and typography scale
- **HTTP Standards**: Method names and header configurations

#### Usage Examples:
```javascript
import { COLOR_PRIMARY, NAV_NAME_DASHBOARD, REST_BASE_URL } from '../tools/constant';

// Using colors
<View style={{ backgroundColor: COLOR_PRIMARY }} />

// Navigation
NavigationService.navigate(NAV_NAME_DASHBOARD);

// API calls
const url = `${REST_BASE_URL}${REST_URL_LOGIN}`;
```

#### Design System Structure:
```javascript
// Color Categories
COLOR_PRIMARY           // Brand primary color
COLOR_SECONDARY_*       // Supporting colors
COLOR_ERROR/COLOR_RED   // Feedback colors
COLOR_GRAY_*           // Neutral palette
COLOR_TRANSPARENT_*    // Semi-transparent variants

// Typography Scale
FONT_SIZE_H1-H4        // Heading hierarchy
FONT_SIZE_BODY_*       // Body text sizes
FONT_SIZE_BUTTON       // Interactive elements
```

---

### 📊 `chartUtils.js` - Chart Visualization Utilities

**Purpose**: Advanced utilities for creating responsive and interactive water monitoring charts with react-native-gifted-charts.

#### Key Features:
- **Responsive Sizing**: Dynamic chart dimensions based on screen size
- **Color Management**: Smart color selection for actual vs forecast data
- **Interactive Tooltips**: Rich, context-aware pointer labels
- **Chart Type Detection**: Automatic detection and formatting for different chart types
- **Performance Optimization**: Efficient rendering and spacing calculations

#### Supported Chart Types:
1. **Daily/Hourly Charts**: 24-hour format with time display
2. **Period Charts**: Date range with specific time periods
3. **Monthly Charts**: Yearly overview with monthly aggregation
4. **Mixed Data Charts**: Combined actual and forecast visualization

#### Usage Examples:
```javascript
import { 
  getDynamicGradientColors, 
  createPointerConfig, 
  chartPresets 
} from '../tools/chartUtils';

// Dynamic colors based on data composition
const colors = getDynamicGradientColors(waterData);

// Chart configuration
const chartConfig = {
  ...chartPresets.responsive,
  startFillColor: colors.startFillColor,
  endFillColor: colors.endFillColor
};

// Interactive tooltips
const pointerConfig = createPointerConfig(chartPresets.colors, 'monthly');
```

#### Utility Functions:
```javascript
// Screen and layout
getScreenDimension()                 // Get current screen size
calculateDynamicSpacing(dataLength)  // Optimal point spacing
calculateChartWidth(dataLength)      // Scrollable chart width
calculateMaxValue(data)              // Y-axis maximum with padding

// Color management  
getDynamicGradientColors(data)       // Smart gradient selection
getMixedGradientColors(data)         // Blended colors for mixed data
getDataPointColors(data)             // Individual point colors

// Formatting
formatHourDisplay(hour)              // 24h to AM/PM conversion
createPointerConfig(colors, type)    // Rich tooltip configuration
```

---

### 🧭 `navigationService.js` - Navigation Service Layer

**Purpose**: Centralized navigation service for programmatic navigation outside of React components with comprehensive error handling.

#### Key Features:
- **Programmatic Navigation**: Navigate from Redux actions, API callbacks, utilities
- **Safety Checks**: Navigation readiness validation prevents crashes
- **Error Handling**: Comprehensive error catching and fallback mechanisms
- **Stack Management**: Full control over navigation stack manipulation
- **State Management**: Navigation state inspection and debugging utilities

#### Core Functions:
```javascript
import NavigationService from '../tools/navigationService';

// Basic navigation
NavigationService.navigate('Dashboard', { userId: 123 });

// Stack manipulation
NavigationService.back();              // Go back
NavigationService.replace('Login');    // Replace current screen
NavigationService.popToTop();          // Return to root
NavigationService.reset('Dashboard');  // Clear history and reset

// Utility checks
NavigationService.isReady();           // Check if container ready
NavigationService.canGoBack();         // Check if back possible
NavigationService.getCurrentRouteName(); // Get active route
```

#### Advanced Features:
```javascript
// Strategic navigation
NavigationService.navigateWithStrategy('Profile', {}, true); // Replace instead of push

// Safe navigation with fallback
NavigationService.safeNavigate('ProfileDetail', 'ProfileList', { userId: 123 });

// Navigation state inspection
const navState = NavigationService.getNavigationState();
console.log('Navigation stack:', navState?.routes);
```

#### Error Handling:
- ✅ Navigation readiness checks
- ✅ Back navigation validation  
- ✅ Error logging and recovery
- ✅ Fallback mechanisms
- ✅ Console debugging information

---

## 🎯 **Best Practices**

### 1. **Constant Usage**
```javascript
// ✅ Good - Use constants
import { COLOR_PRIMARY, NAV_NAME_DASHBOARD } from '../tools/constant';

// ❌ Avoid - Magic strings/values
const color = '#03AED2';
navigate('Dashboard');
```

### 2. **Chart Utilities**
```javascript
// ✅ Good - Use responsive utilities
const spacing = calculateDynamicSpacing(data.length);
const colors = getDynamicGradientColors(data);

// ❌ Avoid - Fixed values
const spacing = 50;
const color = '#FF0000';
```

### 3. **Navigation Service**
```javascript
// ✅ Good - Check readiness and handle errors
if (NavigationService.navigate('Profile')) {
  console.log('Navigation successful');
}

// ❌ Avoid - Direct navigation without checks
navigationRef.navigate('Profile');
```

## 🔧 **Configuration Guidelines**

### Color System Usage:
1. **Primary Actions**: Use `COLOR_PRIMARY` for main buttons and active states
2. **Feedback States**: Use `COLOR_ERROR`/`COLOR_RED` for errors, `COLOR_PRIMARY_ACCEPT` for success
3. **Text Hierarchy**: Use `COLOR_BLACK` for primary text, `COLOR_DISABLED` for secondary
4. **Backgrounds**: Use appropriate transparent variants for overlays

### Chart Configuration:
1. **Responsive Design**: Always use dynamic spacing and sizing utilities
2. **Data Visualization**: Use appropriate colors for actual vs forecast data
3. **Accessibility**: Ensure sufficient color contrast and readable text sizes
4. **Performance**: Use optimized chart presets for smooth animations

### Navigation Patterns:
1. **Authentication Flow**: Use `reset()` to clear history after login/logout
2. **Deep Linking**: Use `safeNavigate()` for error recovery
3. **Modal Flow**: Use `replace()` to prevent unwanted back navigation
4. **Error Handling**: Always check navigation success in critical flows

## 🧪 **Testing Utilities**

### Chart Testing:
```javascript
// Test responsive calculations
const testData = [{ value: 2.5 }, { value: 3.1 }];
const spacing = calculateDynamicSpacing(testData.length);
expect(spacing).toBeGreaterThan(40);

// Test color generation
const colors = getDynamicGradientColors(testData);
expect(colors.startFillColor).toBeDefined();
```

### Navigation Testing:
```javascript
// Mock navigation service
jest.mock('../tools/navigationService');

// Test navigation calls
NavigationService.navigate('Dashboard');
expect(NavigationService.navigate).toHaveBeenCalledWith('Dashboard');
```

## 📱 **Platform Considerations**

### iOS vs Android:
- Use platform-specific secondary colors: `COLOR_SECONDARY_MAIN_IOS` vs `COLOR_SECONDARY_MAIN_ANDROID`
- Chart animations may perform differently across platforms
- Navigation behavior follows platform conventions

### Screen Sizes:
- Utilities automatically adapt to different screen sizes
- Chart spacing and sizing are responsive by default
- Typography scales appropriately for accessibility

## 🚀 **Performance Tips**

1. **Chart Optimization**:
   - Use `chartPresets.responsive` for optimal settings
   - Limit animation duration for better performance
   - Use appropriate data point spacing to prevent overcrowding

2. **Navigation Efficiency**:
   - Check navigation readiness before dispatching actions
   - Use `replace()` instead of `navigate()` when appropriate to manage memory
   - Clear navigation stack with `reset()` when starting new user flows

3. **Color Management**:
   - Use transparent color variants instead of calculating opacity repeatedly
   - Cache color calculations for frequently used combinations

## 🔄 **Migration and Updates**

### Adding New Constants:
1. Follow existing naming conventions
2. Group related constants together
3. Add comprehensive JSDoc documentation
4. Update this README with usage examples

### Extending Chart Utils:
1. Maintain backward compatibility
2. Add comprehensive error handling
3. Include examples and documentation
4. Test across different data types and sizes

### Navigation Enhancements:
1. Preserve existing API compatibility
2. Add comprehensive error handling
3. Include debugging utilities
4. Test navigation flows thoroughly

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: Development Team
