import React, { useCallback, useEffect } from 'react'
import { StyleSheet, Image, View, Alert } from 'react-native'
import { BaseScreen } from '../../components';
import { COLOR_WHITE } from '../../tools/constant';
// import messaging from '@react-native-firebase/messaging';

const SplashScreen = ({ username, onAppear }) => {
  useCallback(
    setTimeout(() => {
      onAppear(username)
    }, 500)
    , []
  )
  // const requestUserPermission = async () => {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     /*
  //     -1 = messaging.AuthorizationStatus.NOT_DETERMINED: Permission has not yet been requested for your application.
  //     0 = messaging.AuthorizationStatus.DENIED: The user has denied notification permissions.
  //     1 = messaging.AuthorizationStatus.AUTHORIZED: The user has accept the permission & it is enabled.
  //     2 = messaging.AuthorizationStatus.PROVISIONAL: Provisional authorization has been granted.
  //     3 = messaging.AuthorizationStatus.EPHEMERAL: The app is authorized to create notifications for a limited amount of time. Used for app clips.
  //     */
  //     await messaging.registerDeviceForRemoteMessages();
  //     const token = await messaging.getToken()
  //       .then((fcmToken) => {
  //         console.log('FCM Token:', fcmToken);
  //         // Do something with the token, like sending it to your server
  //       })
  //       .catch((error) => {
  //         console.log('Error getting FCM token:', error);
  //       });
  //     return token
  //   }
  // }
  useEffect(() => {
    // requestUserPermission()
  }, [])

  return (
    <BaseScreen barBackgroundColor={COLOR_WHITE} contentStyle={{ paddingHorizontal: 20 }}>
      <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: COLOR_WHITE }}>
        <Image
          source={require('../../assets/images/logo.png')}
          resizeMode="contain"
          style={styles.image}
        />
      </View>
    </BaseScreen>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  image: {
    height: 450,
    width: 600,
  }
})