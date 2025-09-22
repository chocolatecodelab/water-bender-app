# Components Documentation

A comprehensive collection of reusable UI components for the Water Monitoring Application. Each component follows clean code principles, includes comprehensive documentation, and maintains consistency across the application.

## 📁 Component Structure

```
src/components/
├── baseScreen/          # Foundation screen wrapper
├── button/              # Interactive button component
├── calender/            # Date picker/calendar
├── header/              # Navigation header
├── keyboardAwareScrollView/  # Keyboard handling
├── label/               # Base text component
├── labels/              # Typography system
├── modal/               # Modal dialogs
├── modalConfirm/        # Confirmation modals
├── modalDelete/         # Delete confirmation
├── modalError/          # Error display
├── modalInfo/           # Information display  
├── modalSuccess/        # Success feedback
└── index.js             # Central exports
```

## 🏗️ Architecture Principles

### Clean Code Standards
- **Single Responsibility**: Each component has one clear purpose
- **Descriptive Naming**: Clear, self-documenting component and prop names
- **Consistent Styling**: Shared style patterns and theme integration
- **Error Handling**: Prop validation and graceful error handling
- **Documentation**: Comprehensive JSDoc comments and usage examples

### Design Patterns
- **Composition over Inheritance**: Components are composable and flexible
- **Props Interface**: Clear TypeScript-style prop definitions
- **Default Props**: Sensible defaults to reduce boilerplate
- **Render Functions**: Complex rendering logic separated into focused functions

## 🎨 Component Categories

### Layout Components
- **BaseScreen**: Foundation wrapper for all screens
- **KeyboardView**: Keyboard-aware scroll container

### UI Components
- **Button**: Interactive button with multiple states
- **Header**: Navigation header with customizable actions
- **Calendar**: Date selection with automatic range calculation

### Typography System
- **Label**: Base text component with styling options
- **Labels Collection**: Pre-configured text variants (H1-H4, Body variants)

### Modal System
- **Modal**: Base modal with customizable features
- **ModalConfirm**: Confirmation dialogs
- **ModalError**: Error message display
- **ModalInfo**: Information display
- **ModalSuccess**: Success feedback
- **ModalDelete**: Delete confirmation

## 🚀 Usage Examples

### Basic Import
```javascript
import { BaseScreen, Button, H1, MyModal } from '@components';
```

### Component Usage
```javascript
// Screen wrapper
<BaseScreen useScrollViewContainer>
  <H1>Water Monitoring Dashboard</H1>
  <Button 
    caption="Refresh Data"
    loading={isLoading}
    onPress={handleRefresh}
  />
</BaseScreen>

// Modal usage
<MyModal
  isVisible={showModal}
  headerActive
  headerTitle="Settings"
  closeModal={() => setShowModal(false)}
>
  <SettingsContent />
</MyModal>
```

## 📱 Responsive Design

All components are built with responsive design principles:
- **Screen Size Adaptation**: iPad, iOS, and Android specific adjustments
- **Touch Target Optimization**: Minimum 44px touch targets
- **Accessibility Support**: Screen reader and keyboard navigation
- **Performance**: Optimized rendering and memory usage

## 🎯 Best Practices

### Component Development
1. **Start with Props Interface**: Define clear prop types and defaults
2. **Separate Concerns**: Split complex components into focused functions
3. **Style Consistency**: Use shared constants and theme values
4. **Error Boundaries**: Handle edge cases and invalid props gracefully
5. **Test Coverage**: Include testID props for automated testing

### Usage Guidelines
1. **Import Efficiency**: Import only needed components
2. **Prop Validation**: Provide required props and handle optionals
3. **Style Override**: Use style props for customization
4. **Performance**: Avoid unnecessary re-renders with proper prop usage

## 🔧 Customization

### Theme Integration
Components integrate with the application theme through:
```javascript
import {
  COLOR_PRIMARY,
  COLOR_WHITE,
  COLOR_MAIN_SECONDARY,
  FONT_SIZE_H1,
  // ... other constants
} from '../../tools/constant';
```

### Style Overrides
Most components accept style props for customization:
```javascript
<Button
  containerStyle={{ backgroundColor: COLOR_SECONDARY }}
  textStyle={{ fontSize: 18, fontWeight: 'bold' }}
/>

<BaseScreen
  containerStyle={{ padding: 20 }}
  contentStyle={{ backgroundColor: COLOR_LIGHT }}
/>
```

## 🐛 Debugging & Testing

### Development Tools
- **Console Warnings**: Components log helpful warnings for missing props
- **Test IDs**: All components include testID props for automated testing
- **PropTypes**: Runtime prop validation in development builds

### Common Issues
1. **Missing Props**: Check console for prop validation warnings
2. **Style Conflicts**: Ensure custom styles don't override critical layouts
3. **Performance**: Monitor re-renders in complex component trees

## 🔄 Future Enhancements

### Planned Improvements
- [ ] TypeScript migration for better type safety
- [ ] Storybook integration for component documentation
- [ ] Unit test coverage for all components
- [ ] Performance monitoring and optimization
- [ ] Accessibility audit and improvements

### Contributing
When adding new components:
1. Follow the established pattern and documentation style
2. Include comprehensive JSDoc comments
3. Add prop validation and default values
4. Update this README with component description
5. Include usage examples in the component file

---

## 📞 Support

For questions about component usage or issues:
1. Check component-specific documentation in the file headers
2. Review usage examples in the JSDoc comments
3. Refer to existing implementations in the screens directory
4. Contact the development team for architectural decisions
