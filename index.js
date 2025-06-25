/**
 * @format
 */
import React, { useEffect } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { PermissionsAndroid } from 'react-native';
import { name as appName } from './app.json';
import App from './src';
import store from './src/redux/store';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
// Only import for side effects, do not use firebase.initializeApp()
import '@react-native-firebase/app';

const RNRoot = () => {
  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('fcm token', fcmToken);
    }
  }
  checkToken()
  async function subscribeToCountryTopic(country) {
    // const topic = `country_${country}`;
    const topic = `country_China`;
    await messaging().subscribeToTopic(topic);
    console.log(`Subscribed to ${topic}`);
  }
  const getUser = async () => {
    let userData = await AsyncStorage.getItem('USER');
    userData = JSON.parse(userData);
    subscribeToCountryTopic(userData?.country);
    console.log(`userData`, userData);
  };

  getUser();
  useEffect(() => {
    getUser();
  }, [AsyncStorage])
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.createChannel(
        {
          channelId: "channel-id",
          channelName: "My channel",
          channelDescription: "A channel to categorise your notifications",
          playSound: true,
          soundName: "default",
          importance: 2,
          vibrate: true,
        },
      );

      PushNotification.localNotification({
        channelId: "channel-id",
        title: remoteMessage?.notification?.title,
        message: remoteMessage?.notification?.body,
        playSound: true,
        soundName: "default",
      });
    });

    return unsubscribe;
  }, [])

  // Register background handler
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => RNRoot);
