import { Dimensions, Platform } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { HTTP_HEADER_VALUE_JSON, REST_BASE_URL, REST_METHOD_DELETE, REST_METHOD_GET, REST_METHOD_POST, REST_METHOD_PUT } from "./constant";
import DeviceInfo from 'react-native-device-info';
// import messaging from '@react-native-firebase/messaging';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import firestore from '@react-native-firebase/firestore';
// import notifee, { AndroidImportance } from '@notifee/react-native';

export const iconTools = {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
  AntDesign,
  Entypo,
  Octicons,
  EvilIcons,
}
export const ios = Platform.OS === 'ios';
export const android = Platform.OS === 'android';
export const iPad = DeviceInfo.getModel().includes('iPad');

export const stringMonth = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des"
];


export const getScreenDimension = () => {
  const { height, width } = Dimensions.get('window');
  return { height, width };
};

export const sortAsc = (a, b) => (a > b ? 1 : -1);
export const sortDesc = (a, b) => (a > b ? -1 : 1);

export const convertArrToObj = (array, objKey) => (!array ? {} : array.reduce(
  (obj, item) => ({ ...obj, [item[objKey]]: item }), {},
));

const getHttpHeaders = async (authenticationToken) => {
  let headers = {
    'Content-Type': HTTP_HEADER_VALUE_JSON,
  };

  if (authenticationToken) {
    headers = { ...headers, Authorization: authenticationToken };
  }
  return headers;
};

const getHttpHeadersFormData = async (authenticationToken) => {
  let headers = {
    'Content-Type': 'multipart/form-data',
  };

  if (authenticationToken) {
    headers = { ...headers, Authorization: authenticationToken };
  }
  return headers;
};

export const sendPostFormRequest = async (apiPath, body, authenticationToken, customBaseUrl) => {
  const url = customBaseUrl ? `${customBaseUrl}${apiPath}` : `${REST_BASE_URL}${apiPath}`;
  const method = REST_METHOD_POST;
  const headers = await getHttpHeadersFormData(authenticationToken);
  const response = await fetch(url, { method, headers, body });
  return processResponse(response, url);
};

export const sendGetRequest = async (apiPath, authenticationToken, customBaseUrl) => {
  const url = customBaseUrl ? `${customBaseUrl}${apiPath}` : `${REST_BASE_URL}${apiPath}`;
  const method = REST_METHOD_GET;
  const headers = await getHttpHeaders(authenticationToken);
  const response = await fetch(url, { method, headers });
  return processResponse(response, url);
};

export const sendPostRequest = async (apiPath, body, authenticationToken, customBaseUrl) => {
  const bodyStr = JSON.stringify(body);
  console.log(bodyStr);
  const url = customBaseUrl ? `${customBaseUrl}${apiPath}` : `${REST_BASE_URL}${apiPath}`;
  const method = REST_METHOD_POST;
  const headers = await getHttpHeaders(authenticationToken);
  const response = await fetch(url, { method, headers, body: bodyStr });
  return processResponse(response, url);
};

export const sendPutRequest = async (apiPath, body, authenticationToken, customBaseUrl) => {
  const bodyStr = JSON.stringify(body);
  const url = customBaseUrl ? `${customBaseUrl}${apiPath}` : `${REST_BASE_URL}${apiPath}`;
  const method = REST_METHOD_PUT;
  const headers = await getHttpHeaders(authenticationToken);
  const response = await fetch(url, { method, headers, body: bodyStr });
  return processResponse(response);
};

export const sendDeleteRequest = async (apiPath, authenticationToken, customBaseUrl) => {
  const url = customBaseUrl ? `${customBaseUrl}${apiPath}` : `${REST_BASE_URL}${apiPath}`;
  const method = REST_METHOD_DELETE;
  const headers = await getHttpHeaders(authenticationToken);
  const response = await fetch(url, { method, headers });
  return processResponse(response);
};

const processResponse = async (response, url) => {
  const responseJSON = await response.json();
  if (response.status >= 200 && response.status <= 299) {
    return responseJSON;
  }

  const errorMessage = responseJSON ? responseJSON.Message ? responseJSON.Message : responseJSON.message : '';
  throw new Error(errorMessage);
};

// notification helper
// export const requestPermission = async () => {
//   const authStatus = await messaging().requestPermission();
//   const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL
//   if (enabled) {
//     console.log("Authorization status", authStatus)
//   }
// }

// export const getFCMToken = async () => {
//   let fcmToken = await AsyncStorage.getItem("fcmtoken");
//   console.log(fcmToken, "old token");
//   if (!fcmToken) {
//     try {
//       const fcmToken = await messaging().getToken();
//       if (fcmToken) {
//         console.log(fcmToken, "new token");
//         await AsyncStorage.setItem("fcmtoken", fcmToken);
//       }
//     } catch (error) {
//       console.log(error, "error in fcmtoken")
//     }
//   }
// };

// export const sendFCMToken = async (email) => {
//   let fcmToken = await AsyncStorage.getItem("fcmtoken");
//   console.log(fcmToken, "old token");
//   if (!fcmToken) {
//     try {
//       fcmToken = await messaging().getToken();
//       if (fcmToken) {
//         console.log(fcmToken, "new token");
//         await AsyncStorage.setItem("fcmtoken", fcmToken);
//       }
//     } catch (error) {
//       console.log(error, "error in fcmtoken")
//     }
//   }
//   console.log("mencek token" + fcmToken);
//   // Mengecek apakah email sudah ada dalam koleksi 'Users'
//   if (email) {
//     firestore()
//       .collection('tokenUsers')
//       .where('email', '==', email)
//       .get()
//       .then((querySnapshot) => {
//         if (querySnapshot.size > 0) {
//           // Email sudah ada, periksa apakah token juga sudah ada
//           const userDoc = querySnapshot.docs[0];
//           const userData = userDoc.data();
//           const existingTokens = userData.token || [];
//           let arrayTokens = [];
//           // Mengecek apakah token sudah ada
//           const newTokens = !existingTokens.includes(fcmToken);
//           if (newTokens) {
//             if (!Array.isArray(existingTokens)) {
//               arrayTokens = [existingTokens];
//             } else {
//               // Menambahkan token baru ke dalam daftar token yang terkait dengan email tersebut
//               userDoc.ref.update({
//                 token: [...existingTokens, fcmToken]
//               })
//                 .then(() => {
//                   console.log('New token(s) added for existing user!');
//                 })
//                 .catch((error) => {
//                   console.error('Error updating user document:', error);
//                 });
//             }
//           } else {
//             console.log('Token already exists for this user. No new token added.');
//           }
//         } else {
//           // Email belum ada, tambahkan email dan token baru sebagai dokumen baru dalam koleksi
//           firestore()
//             .collection('tokenUsers')
//             .add({
//               email: email,
//               token: [fcmToken]
//             })
//             .then(() => {
//               console.log('New user added!');
//             })
//             .catch((error) => {
//               console.error('Error adding new user:', error);
//             });
//         }
//       })
//       .catch((error) => {
//         console.error('Error getting user document:', error);
//       });
//   } else {
//     console.log('Email is empty. Operation aborted.');
//   }


// }


// export const NotificationListener = () => {

//   messaging().onNotificationOpenedApp(remoteMessage => {
//     console.log("Notification caused app to open from background state:", remoteMessage.notification)
//   });

//   //check whether in initial notification is available
//   messaging().getInitialNotification().then(remoteMessage => {
//     console.log("Notification caused app to open from quit state:", remoteMessage.notification)
//   });

//   messaging().onMessage(async remoteMessage => {
//     console.log("notification on foreground state....", remoteMessage.notification);
//   })
// }


//push notification display
export const onDisplayNotification = async (title, description, conditional = "") => {
  // Request permissions (required for iOS)
//   await notifee.requestPermission()

  // Create a channel (required for Android)
//   const channelId = await notifee.createChannel({
//     id: 'default',
//     name: 'Default Channel',
//     sound: 'cute_sound',
//     badge: true,
//     importance: AndroidImportance.HIGH,
    
//   });

  // Display a notification
//   await notifee.displayNotification({
//     title: title,
//     body: conditional + description,
//     android: {
//       channelId,
//       smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
//       largeIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
//     },
//   });
} 




