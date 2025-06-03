import React,{useEffect} from 'react';
// import { PermissionsAndroid } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './Type/StackNavigation';
// import PushNotification from "react-native-push-notification";
// import messaging from '@react-native-firebase/messaging';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppNavigator() {
  
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
}
