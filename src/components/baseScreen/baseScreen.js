import React from 'react';
import { View, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { COLOR_WHITE } from '../../tools/constant';

const BaseScreen = ({
  children, containerStyle, contentStyle, barBackgroundColor, translucent,
  statusBarColor, hiddenBar, useScrollViewContainer = false, ...props
}) => {
  return (
    <SafeAreaProvider style={[styles.container, containerStyle]}>
      <StatusBar
        hidden={hiddenBar}
        translucent={translucent}
        backgroundColor={barBackgroundColor}
        barStyle={statusBarColor === COLOR_WHITE ? 'light-content' : 'dark-content'}
      />
      {useScrollViewContainer &&
        <ScrollView
          style={[styles.contentWrapper, contentStyle]}
          showsVerticalScrollIndicator={false}
          {...props}
        >
          {children}
        </ScrollView>
      }
      {!useScrollViewContainer &&
        <View style={[styles.contentWrapper, contentStyle]}>
          {children}
        </View>
      }
    </SafeAreaProvider>
  );
};

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

export default BaseScreen;

