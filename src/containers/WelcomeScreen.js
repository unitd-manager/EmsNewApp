import { ImageBackground, StyleSheet,Alert,PermissionsAndroid, View } from 'react-native';
import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import {useNavigation} from '@react-navigation/native';
//import PushNotification from "react-native-push-notification";
//import AsyncStorage from '@react-native-async-storage/async-storage';
// Custom Imports
import images from '../assets/images';
import { commonColor, styles } from '../themes';
import { moderateScale } from '../common/constants';
import EButton from '../components/common/EButton';
import { StackNav } from '../navigation/NavigationKeys';
//import messaging from '@react-native-firebase/messaging';
//import NotificationController from '../utils/NotificationController';

export default function WelcomeScreen() {
  const colors = useSelector((state) => state.theme.theme);
  const navigation = useNavigation();

//   const checkToken = async () => {
  
//     const fcmToken = await messaging().getToken();
//     if (fcmToken) {
   
//       console.log('fcm token', fcmToken);
//     }
//   }
//   checkToken()
// // Subscribe the user to a country topic
// async function subscribeToCountryTopic(country) {
//   const topic = `country_${country}`;
//   await messaging().subscribeToTopic(topic);
//   console.log(`Subscribed to ${topic}`);
// }

// useEffect(()=>{
//   const getUser = async () => {
//     let userData = await AsyncStorage.getItem('USER');
//     userData = JSON.parse(userData);
//     subscribeToCountryTopic(userData?.country);
//   };
//   getUser();
// },[])
//   PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
//   useEffect(()=>{
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
//       PushNotification.createChannel(
//         {
//           channelId: "channel-id", 
//           channelName: "My channel", 
//           channelDescription: "A channel to categorise your notifications", 
//           playSound: true, 
//           soundName: "default", 
//           importance: Importance.HIGH, 
//           vibrate: true, 
         
//         },
        
//       );
    
//     PushNotification.localNotification({
//       channelId: "channel-id", // 
//       // channelName: "My channel", 
//       title: remoteMessage?.notification?.title, 
//       message: remoteMessage?.notification?.body, 
//       // picture: "https://www.example.tld/picture.jpg", // (optional) Display an picture with the notification, alias of bigPictureUrl for Android. default: undefined
//       // userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
//       playSound: true, 
//       soundName: "default", 
//       });
//     });
   
//     return unsubscribe;
   
//   },[])


//     // Register background handler
//     messaging().setBackgroundMessageHandler(async remoteMessage => {
//       console.log('Message handled in the background!', remoteMessage);
//     });

  return (
    <ImageBackground
      source={images.getStarted}
      style={localStyles.imageStyle}
      resizeMode="cover">
      <View style={localStyles.container}>
      <EButton
            title="Getting Start"
            type={'S16'}
            // color={isSubmitDisabled && colors.white}
            containerStyle={localStyles.signBtnContainer}
            onPress={() => navigation.navigate(StackNav.HomeTab)}
            // bgColor={isSubmitDisabled && colors.primaryD}
            // disabled={isSubmitDisabled}
          />
      </View>
    </ImageBackground>
  );
}

const localStyles = StyleSheet.create({
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 55,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  topContainer: {
    ...styles.m20,
    ...styles.rowSpaceBetween,
    ...styles.p15,
    borderRadius: moderateScale(12),
  },
  skipBtnContainer: {
    width: '35%',
    height: moderateScale(35),
    borderRadius: moderateScale(17),
    borderWidth: moderateScale(1),
    borderColor: commonColor.primary5,
  },
  signBtnContainer:{
    backgroundColor: commonColor.greenColor,
  }
});