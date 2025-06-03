import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {StackNav} from '../NavigationKeys';
import {StackRoute} from '../NavigationRoutes';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={StackNav.HomeTab}>
      <Stack.Screen name={StackNav.HomeTab} component={StackRoute.HomeTab} />
      <Stack.Screen name={StackNav.Login} component={StackRoute.Login} />
          <Stack.Screen name={StackNav.SignUp} component={StackRoute.SignUp} />
          <Stack.Screen name={StackNav.ForgotPass} component={StackRoute.ForgotPass} />
    </Stack.Navigator>
  );
}
