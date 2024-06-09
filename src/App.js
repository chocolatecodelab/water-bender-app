/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { SplashScreen, DashbordScreen, RegisterScreen, LoginScreen } from './screens';

import { NavigationContainer } from '@react-navigation/native';
import navigationService from './tools/navigationService';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { LogBox, Text, View } from 'react-native';
import { NAV_NAME_DASHBOARD, NAV_NAME_LOGIN, NAV_NAME_SPLASH, NAV_NAME_REGISTER } from './tools/constant';

const Stack = createStackNavigator();

function MainNavigation() {
  LogBox.ignoreLogs(['Remote debugger']);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer ref={navigationService.navigationRef}>
          <Stack.Navigator initialRouteName={NAV_NAME_SPLASH}>
            <Stack.Screen
              name={NAV_NAME_SPLASH}
              component={SplashScreen}
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                headerShown: false,
              }}
            />
            <Stack.Screen
            name={NAV_NAME_DASHBOARD}
            component={DashbordScreen}
            options={{ 
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              headerShown:false,
             }}
            />
            <Stack.Screen
              name={NAV_NAME_LOGIN}
              component={LoginScreen}
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                headerShown: false,

              }}
            />
            <Stack.Screen
              name={NAV_NAME_REGISTER}
              component={RegisterScreen}
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}





export default MainNavigation;
