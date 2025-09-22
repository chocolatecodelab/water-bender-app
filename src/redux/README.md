# Redux State Management Documentation

## Overview

This Redux implementation provides comprehensive state management for the Water Monitoring React Native application. Built with Redux Toolkit, it follows modern Redux patterns with clean code principles, comprehensive error handling, and extensive documentation.

## Architecture

```
redux/
├── store.js                 # Main Redux store configuration
└── features/               # Feature-based Redux slices
    ├── home/              # Water monitoring data management
    │   ├── homeSlice.js   # Home state slice with async thunks
    │   └── homeService.js # Water data API service layer
    ├── login/             # Authentication management
    │   ├── loginSlice.js  # Authentication state slice
    │   └── loginService.js # Authentication API service
    └── register/          # User registration management
        ├── registerSlice.js # Registration state slice
        └── registerService.js # Registration API service
```

## Features

### 🏪 Store Configuration (`store.js`)
- **Redux Persist**: Automatic state persistence with AsyncStorage
- **Development Tools**: Enhanced debugging with Redux DevTools
- **Middleware**: Thunk middleware for async operations
- **Error Handling**: Comprehensive error boundaries and logging
- **Performance**: Optimized for React Native with selective persistence

### 🏠 Home Feature (`features/home/`)
Water monitoring data management with real-time updates and forecasting.

#### State Structure
```javascript
{
  // Sensor data
  waterBenderLast: { data: null, loading: false, error: null },
  waterBenderAvg: { data: null, loading: false, error: null },
  waterBenderMonthly: { data: null, loading: false, error: null },
  waterBenderDaily: { data: null, loading: false, error: null },
  waterBenderForecast: { data: null, loading: false, error: null },
  
  // Metadata
  lastUpdate: null,
  cacheExpiry: null
}
```

#### Available Actions
- `downloadingWaterBenderLastAsync` - Get latest sensor reading
- `downloadingWaterBenderAvgAsync` - Get average data for date range
- `downloadingWaterBenderMonthlyAsync` - Get monthly aggregated data
- `downloadingWaterBenderDailyAsync` - Get daily hourly readings
- `downloadingWaterBenderForecastAsync` - Get weather forecast predictions

### 🔐 Login Feature (`features/login/`)
User authentication with secure credential handling and session management.

#### State Structure
```javascript
{
  // Form credentials
  username: '',
  password: '',
  
  // Request state
  isError: false,
  isSuccess: false,
  isLoading: false,
  
  // User session
  user: null,
  message: '',
  lastLoginAttempt: null,
  validationErrors: {}
}
```

#### Available Actions
- `uploadLoginAsync` - Authenticate user credentials
- `setUsername` - Update username field
- `setPassword` - Update password field
- `resetAuth` - Reset authentication status
- `logout` - Clear user session

### 👤 Register Feature (`features/register/`)
User registration with comprehensive validation and security features.

#### State Structure
```javascript
{
  // Request state
  isError: false,
  isSuccess: false,
  isLoading: false,
  
  // Registration data
  message: '',
  validationErrors: {},
  lastRegistrationAttempt: null,
  registrationData: null,
  
  // Multi-step support
  step: 1,
  totalSteps: 1
}
```

#### Available Actions
- `fetchRegister` - Register new user account
- `resetRegister` - Reset registration state
- `setValidationErrors` - Update form validation errors
- `clearFieldError` - Clear specific field error

## Service Layer

### API Service Functions

#### Home Service (`homeService.js`)
```javascript
// Get latest sensor reading
await downloadingWaterBenderLast()

// Get average data for date range
await downloadingWaterBenderAvg({ startDate: '2024-01-01', endDate: '2024-01-31' })

// Get monthly data for year
await downloadingWaterBenderMonthly('2024')

// Get daily hourly readings
await downloadingWaterBenderDaily()

// Get forecast predictions
await downloadingWaterBenderForecast(12) // 12 hours
```

#### Login Service (`loginService.js`)
```javascript
// Authenticate user
await uploadLogin({
  username: 'user123',
  password: 'securePassword'
})

// Check service health
await checkLoginServiceHealth()
```

#### Register Service (`registerService.js`)
```javascript
// Register new user
await uploadRegisterAsync({
  username: 'newuser',
  email: 'user@example.com',
  password: 'SecurePass123!',
  fullName: 'New User'
})

// Analyze password strength
analyzePasswordStrength('password123')
```

## Usage Examples

### Dispatching Actions
```javascript
import { useDispatch, useSelector } from 'react-redux'
import { 
  downloadingWaterBenderLastAsync,
  selectWaterBenderLast,
  selectWaterBenderLastLoading
} from '../redux/features/home/homeSlice'

const MyComponent = () => {
  const dispatch = useDispatch()
  const waterData = useSelector(selectWaterBenderLast)
  const isLoading = useSelector(selectWaterBenderLastLoading)

  const fetchLatestData = () => {
    dispatch(downloadingWaterBenderLastAsync())
  }

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Text>{waterData?.value}</Text>
      )}
      <Button title="Refresh" onPress={fetchLatestData} />
    </View>
  )
}
```

### Using Selectors
```javascript
// Home selectors
import { 
  selectWaterBenderLast,
  selectWaterBenderAvg,
  selectIsWaterDataLoading,
  selectWaterDataError 
} from '../redux/features/home/homeSlice'

// Auth selectors
import {
  selectIsAuthenticated,
  selectCurrentUser,
  selectAuthLoading,
  selectAuthFormState
} from '../redux/features/login/loginSlice'

// Registration selectors
import {
  selectRegistrationLoading,
  selectRegistrationFormState,
  selectCanSubmitRegistration
} from '../redux/features/register/registerSlice'
```

## Error Handling

All Redux operations include comprehensive error handling:

```javascript
// Automatic error extraction
const extractErrorMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.message) return error.message
  return 'An unexpected error occurred'
}

// Usage in components
const error = useSelector(selectWaterDataError)
if (error) {
  console.error('Water data error:', error)
}
```

## Best Practices

### 1. Use Selectors
Always use selectors to access state:
```javascript
// ✅ Good
const data = useSelector(selectWaterBenderLast)

// ❌ Avoid
const data = useSelector(state => state.home.waterBenderLast.data)
```

### 2. Handle Loading States
Always handle loading and error states:
```javascript
const Component = () => {
  const isLoading = useSelector(selectWaterBenderLastLoading)
  const error = useSelector(selectWaterDataError)
  const data = useSelector(selectWaterBenderLast)

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!data) return <EmptyState />
  
  return <DataDisplay data={data} />
}
```

### 3. Validate Before Dispatch
Use validation utilities before dispatching:
```javascript
import { serviceUtils } from '../redux/features/home/homeService'

const handleDateRangeSubmit = (startDate, endDate) => {
  try {
    serviceUtils.validateDateRange({ startDate, endDate })
    dispatch(downloadingWaterBenderAvgAsync({ startDate, endDate }))
  } catch (error) {
    showErrorMessage(error.message)
  }
}
```

## Security Features

### 1. Credential Protection
- Passwords are never logged or exposed
- Automatic credential sanitization
- Secure session management

### 2. Input Validation
- Client-side validation before API calls
- SQL injection prevention
- XSS protection through sanitization

### 3. Error Security
- No sensitive data in error messages
- Prevent account enumeration attacks
- Rate limiting support

## Performance Optimizations

### 1. Selective Persistence
Only essential data is persisted:
```javascript
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['home'], // Only persist home state
  blacklist: ['login'] // Don't persist sensitive auth data
}
```

### 2. Memoized Selectors
Selectors are optimized for performance:
```javascript
export const selectWaterDataSummary = createSelector(
  [selectWaterBenderLast, selectWaterBenderAvg],
  (last, avg) => ({
    current: last?.data?.value,
    average: avg?.data?.average,
    trend: calculateTrend(last, avg)
  })
)
```

### 3. Cache Management
Automatic cache expiry and refresh:
```javascript
// Cache expires after 5 minutes for real-time data
const CACHE_EXPIRY = 5 * 60 * 1000
```

## Debugging

### 1. Redux DevTools
Use Redux DevTools for debugging:
```javascript
// Enable in development
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }),
  devTools: __DEV__ // Only in development
})
```

### 2. Logging
Comprehensive logging for debugging:
```javascript
// Service layer logging
console.log('🔄 Fetching water data:', { params })
console.log('✅ Water data retrieved:', { dataPoints: response.length })
console.error('❌ Water data error:', { error: error.message })
```

## Testing

### 1. Action Testing
```javascript
// Test async thunks
import { downloadingWaterBenderLastAsync } from '../homeSlice'

test('should fetch latest water data', async () => {
  const dispatch = jest.fn()
  const getState = jest.fn()
  
  await downloadingWaterBenderLastAsync()(dispatch, getState)
  
  expect(dispatch).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'home/downloadingWaterBenderLast/pending' })
  )
})
```

### 2. Selector Testing
```javascript
// Test selectors
import { selectWaterBenderLast } from '../homeSlice'

test('should select water data', () => {
  const state = {
    home: {
      waterBenderLast: { data: { value: 100 }, loading: false, error: null }
    }
  }
  
  const result = selectWaterBenderLast(state)
  expect(result).toEqual({ value: 100 })
})
```

## Migration Guide

### From Class Components
```javascript
// Old: Class component with connect
class MyComponent extends Component {
  componentDidMount() {
    this.props.fetchWaterData()
  }
  render() {
    return <Text>{this.props.waterData}</Text>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)

// New: Functional component with hooks
const MyComponent = () => {
  const dispatch = useDispatch()
  const waterData = useSelector(selectWaterBenderLast)
  
  useEffect(() => {
    dispatch(downloadingWaterBenderLastAsync())
  }, [dispatch])
  
  return <Text>{waterData?.value}</Text>
}
```

## Troubleshooting

### Common Issues

1. **State not persisting**: Check AsyncStorage permissions and whitelist configuration
2. **Actions not dispatching**: Ensure components are wrapped in `<Provider>`
3. **Selectors returning undefined**: Verify state structure matches selector expectations
4. **Performance issues**: Use memoized selectors and avoid inline selectors

### Debug Checklist

- [ ] Redux DevTools connected and showing actions
- [ ] Store configured with correct reducers
- [ ] Components wrapped in Provider
- [ ] Selectors match actual state structure
- [ ] Actions properly dispatched with correct payloads
- [ ] Error boundaries implemented for error handling

## Contributing

When adding new Redux features:

1. Follow the established file structure
2. Include comprehensive JSDoc documentation
3. Add proper error handling and validation
4. Create optimized selectors
5. Include usage examples
6. Add unit tests for actions and selectors
7. Update this documentation

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: Development Team
