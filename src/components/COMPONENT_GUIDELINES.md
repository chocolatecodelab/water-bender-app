# Component Development Guidelines

This document outlines the standards and best practices for developing components in the Water Monitoring Application.

## 🏗️ Component Structure Template

Every component should follow this structure:

```javascript
/**
 * ComponentName Component
 * 
 * Brief description of what the component does and its purpose.
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 * - Feature 3
 * 
 * @component
 * @example
 * // Basic usage
 * <ComponentName prop1="value1" prop2={value2} />
 * 
 * // Advanced usage
 * <ComponentName 
 *   prop1="value1"
 *   prop2={value2}
 *   customStyle={{ backgroundColor: 'red' }}
 *   onAction={handleAction}
 * >
 *   <ChildContent />
 * </ComponentName>
 */

import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

/**
 * Component Props Interface (JSDoc style)
 * @typedef {Object} ComponentNameProps
 * @property {string} prop1 - Description of prop1
 * @property {number} prop2 - Description of prop2
 * @property {Function} onAction - Callback function
 * @property {Object} customStyle - Custom styling
 * @property {React.ReactNode} children - Child components
 */

// ===== CONSTANTS =====
const COMPONENT_CONSTANTS = {
    DEFAULT_VALUE: 'default',
    MAX_ITEMS: 10,
};

// ===== HELPER FUNCTIONS =====
const helperFunction = (param) => {
    // Helper logic here
    return processedParam;
};

// ===== COMPONENT STYLES =====
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR_WHITE,
    },
    // ... other styles
});

// ===== COMPONENT RENDERERS =====
const renderSection = (data, onAction) => {
    // Complex rendering logic
    return (
        <View>
            {/* Rendered content */}
        </View>
    );
};

// ===== MAIN COMPONENT =====
const ComponentName = ({
    prop1 = 'defaultValue',
    prop2 = 0,
    onAction = () => {},
    customStyle = {},
    children,
    ...otherProps
}) => {
    // State and hooks
    const [state, setState] = useState(initialValue);

    // Effects
    useEffect(() => {
        // Effect logic
    }, [dependencies]);

    // Event handlers
    const handleAction = () => {
        // Handler logic
        onAction();
    };

    // Validation
    if (!requiredProp) {
        console.warn('ComponentName: requiredProp is required');
        return null;
    }

    return (
        <View style={[styles.container, customStyle]} testID="component-name">
            {/* Component content */}
            {children}
        </View>
    );
};

// ===== PROP TYPES =====
ComponentName.propTypes = {
    prop1: PropTypes.string,
    prop2: PropTypes.number,
    onAction: PropTypes.func,
    customStyle: PropTypes.object,
    children: PropTypes.node,
};

// ===== DEFAULT PROPS =====
ComponentName.defaultProps = {
    prop1: 'defaultValue',
    prop2: 0,
    onAction: () => {},
    customStyle: {},
};

export default ComponentName;
```

## 📋 Documentation Standards

### JSDoc Comments
Every component must include:
- **Component description**: What it does and its purpose
- **Features list**: Key capabilities and features
- **Usage examples**: Basic and advanced usage patterns
- **Props documentation**: Complete prop interface documentation

### Code Comments
- **Section headers**: Use `// ===== SECTION NAME =====` format
- **Complex logic**: Explain non-obvious code behavior
- **Business logic**: Document domain-specific requirements
- **Performance notes**: Explain optimization decisions

## 🎨 Styling Guidelines

### Style Organization
```javascript
const styles = StyleSheet.create({
    // Container styles first
    container: { /* */ },
    wrapper: { /* */ },
    
    // Layout styles
    header: { /* */ },
    body: { /* */ },
    footer: { /* */ },
    
    // Element styles
    button: { /* */ },
    text: { /* */ },
    icon: { /* */ },
    
    // State-based styles
    active: { /* */ },
    disabled: { /* */ },
    loading: { /* */ },
});
```

### Theme Integration
Always use theme constants:
```javascript
import {
    COLOR_PRIMARY,
    COLOR_WHITE,
    FONT_SIZE_BODY,
    SPACING_MEDIUM,
} from '../../tools/constant';

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOR_WHITE,
        padding: SPACING_MEDIUM,
    },
    text: {
        fontSize: FONT_SIZE_BODY,
        color: COLOR_PRIMARY,
    },
});
```

## 🔧 Component Props

### Prop Naming Conventions
- **Boolean props**: `is*`, `has*`, `should*`, `can*`
- **Event handlers**: `on*` (onClick, onPress, onSubmit)
- **Style props**: `*Style` (containerStyle, textStyle)
- **Data props**: Descriptive names (userData, itemList)

### Required vs Optional Props
```javascript
ComponentName.propTypes = {
    // Required props
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    
    // Optional props with defaults
    variant: PropTypes.oneOf(['primary', 'secondary']),
    disabled: PropTypes.bool,
    
    // Optional props without defaults
    customStyle: PropTypes.object,
    testID: PropTypes.string,
};

ComponentName.defaultProps = {
    variant: 'primary',
    disabled: false,
    // Don't include optional props without meaningful defaults
};
```

## 🚀 Performance Best Practices

### Render Optimization
```javascript
// Good: Memoized child components
const renderItem = useCallback((item) => {
    return <ItemComponent key={item.id} data={item} />;
}, []);

// Good: Early returns for loading states
if (loading) {
    return <LoadingSpinner />;
}

// Good: Conditional rendering
{showHeader && renderHeader()}
```

### Memory Management
```javascript
// Clean up subscriptions
useEffect(() => {
    const subscription = subscribeToUpdates();
    return () => {
        subscription.unsubscribe();
    };
}, []);

// Use refs for DOM manipulation
const scrollViewRef = useRef(null);
```

## ✅ Testing Guidelines

### Test IDs
Every interactive element should have a testID:
```javascript
<TouchableOpacity 
    testID="submit-button"
    onPress={onSubmit}
>
    <Text testID="submit-button-text">Submit</Text>
</TouchableOpacity>
```

### Accessibility
```javascript
<TouchableOpacity
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel="Submit form"
    accessibilityHint="Submits the current form data"
>
    <Text>Submit</Text>
</TouchableOpacity>
```

## 🐛 Error Handling

### Prop Validation
```javascript
// Validate required props
if (!data || !Array.isArray(data)) {
    console.warn('ListComponent: data prop must be an array');
    return <EmptyState message="No data available" />;
}

// Validate prop combinations
if (loading && error) {
    console.warn('Component: loading and error props should not both be true');
}
```

### Graceful Degradation
```javascript
const SafeComponent = ({ data, onError }) => {
    try {
        return (
            <View>
                {data.map(item => <ItemComponent key={item.id} item={item} />)}
            </View>
        );
    } catch (error) {
        console.error('SafeComponent render error:', error);
        onError?.(error);
        return <ErrorFallback />;
    }
};
```

## 📦 Export Standards

### Default vs Named Exports
```javascript
// Default export for main component
export default ComponentName;

// Named exports for utilities
export {
    helperFunction,
    COMPONENT_CONSTANTS,
    useComponentHook,
};
```

### Index File Updates
When creating new components, update `components/index.js`:
```javascript
// Import new component
import NewComponent from './newComponent/NewComponent';

// Add to exports
export {
    // ... existing exports
    NewComponent,
};
```

## 🔄 Version Control

### Commit Messages
- `feat(components): add NewComponent with feature X`
- `fix(Button): resolve loading state issue`
- `docs(components): update README with new guidelines`
- `refactor(Modal): improve prop validation`

### File Naming
- Component files: `ComponentName.js`
- Style files: `ComponentName.styles.js` (if separate)
- Test files: `ComponentName.test.js`
- Story files: `ComponentName.stories.js`

## 📚 Learning Resources

### React Native Best Practices
- [React Native Performance Guide](https://reactnative.dev/docs/performance)
- [Accessibility Guide](https://reactnative.dev/docs/accessibility)
- [Testing React Native Apps](https://reactnative.dev/docs/testing-overview)

### Code Quality
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [JSDoc Documentation](https://jsdoc.app/)
- [PropTypes Documentation](https://reactjs.org/docs/typechecking-with-proptypes.html)

---

## ✨ Component Checklist

Before marking a component as complete, ensure:

- [ ] JSDoc header with description and examples
- [ ] PropTypes definition with all props documented
- [ ] Default props for optional parameters
- [ ] Error handling for required props
- [ ] Consistent styling using theme constants
- [ ] TestID attributes for testing
- [ ] Accessibility attributes where applicable
- [ ] Performance optimizations (memoization, early returns)
- [ ] Clean code structure with separated concerns
- [ ] Updated exports in index.js
- [ ] Added to component documentation

Following these guidelines ensures consistency, maintainability, and quality across all components in the application.
