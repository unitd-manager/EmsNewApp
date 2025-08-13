import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackRoute} from '../NavigationRoutes';
import {StackNav} from '../NavigationKeys';
import AuthStack from './AuthStack';
import AuthContext, {defaultState, reducer, restoreToken} from './Auth';

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  const [state, dispatch] = React.useReducer(reducer, defaultState);
  React.useEffect(() => {
    restoreToken(dispatch);
  }, []);
  const authContext = React.useMemo(
    () => ({
      signIn: data => {
        dispatch({type: 'SIGN_IN', token: data});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: data => {
        dispatch({type: 'SIGN_IN', token: data});
      },
    }),
    [],
  );

  if (state.isLoading) {
    return null;
  }
  return (
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={StackNav.Splash}>
        <Stack.Screen name={StackNav.Splash} component={StackRoute.Splash} />
        <Stack.Screen
          name={StackNav.WelcomeScreen}
          component={StackRoute.WelcomeScreen}
        />
        <Stack.Screen name={StackNav.HomeTab} component={StackRoute.HomeTab} />
        <Stack.Screen
          name={StackNav.AudioFiles}
          component={StackRoute.AudioFiles}
        />
        <Stack.Screen
          name={StackNav.ListScreen}
          component={StackRoute.ListScreen}
        />
        <Stack.Screen name={StackNav.Music} component={StackRoute.Music} />
        <Stack.Screen
          name={StackNav.DetailScreen}
          component={StackRoute.DetailScreen}
        />
        <Stack.Screen name={StackNav.About} component={StackRoute.About} />
        <Stack.Screen
          name={StackNav.WahdatulWujud}
          component={StackRoute.WahdatulWujud}
        />
        <Stack.Screen
          name={StackNav.GnanaAgamiyas}
          component={StackRoute.GnanaAgamiyas}
        />
        <Stack.Screen name={StackNav.Books} component={StackRoute.Books} />
        <Stack.Screen
          name={StackNav.Programs}
          component={StackRoute.Programs}
        />
        <Stack.Screen
          name={StackNav.Education}
          component={StackRoute.Education}
        />
        <Stack.Screen name={StackNav.Manitha} component={StackRoute.Manitha} />
        <Stack.Screen
          name={StackNav.Collections}
          component={StackRoute.Collections}
        />
        <Stack.Screen
          name={StackNav.EmsDetailScreen}
          component={StackRoute.EmsDetailScreen}
        />
        {state.userToken == null ? (
          <Stack.Screen name={StackNav.Auth} component={AuthStack} />
        ) : (
          <>
            <Stack.Screen
              name={StackNav.CreateNewPassword}
              component={StackRoute.CreateNewPassword}
            />
          </>
        )}
        <Stack.Screen name={StackNav.Quiz} component={StackRoute.Quiz} />
        <Stack.Screen
          name={StackNav.LogOutPage}
          component={StackRoute.LogOutPage}
        />
        <Stack.Screen
          name={StackNav.PhotoGallery}
          component={StackRoute.PhotoGallery}
        />
        <Stack.Screen
          name={StackNav.VideoGallery}
          component={StackRoute.VideoGallery}
        />
        <Stack.Screen
          name={StackNav.AudioGallery}
          component={StackRoute.AudioGallery}
        />
        <Stack.Screen name={StackNav.Login} component={StackRoute.Login} />
        <Stack.Screen name={StackNav.SignUp} component={StackRoute.SignUp} />
        <Stack.Screen
          name={StackNav.ForgotPass}
          component={StackRoute.ForgotPass}
        />
        <Stack.Screen
          name={StackNav.PlayAudio}
          component={StackRoute.PlayAudio}
        />
        <Stack.Screen
          name={StackNav.ProductList}
          component={StackRoute.ProductList}
        />
        <Stack.Screen
          name={StackNav.ProductViewCart}
          component={StackRoute.ProductViewCart}
        />
        <Stack.Screen
          name={StackNav.PaymentSelect}
          component={StackRoute.PaymentSelect}
        />
        <Stack.Screen
          name={StackNav.ProductAddCart}
          component={StackRoute.ProductAddCart}
        />
        <Stack.Screen
          name={StackNav.Magazine}
          component={StackRoute.Magazine}
        />
        <Stack.Screen name={StackNav.Event} component={StackRoute.Event} />
        <Stack.Screen name={StackNav.Payment} component={StackRoute.Payment} />
        <Stack.Screen
          name={StackNav.Articles}
          component={StackRoute.Articles}
        />
        <Stack.Screen name={StackNav.Profile} component={StackRoute.Profile} />
        <Stack.Screen
          name={StackNav.PlayAudioGallery}
          component={StackRoute.PlayAudioGallery}
        />
      </Stack.Navigator>
    </AuthContext.Provider>
  );
}
