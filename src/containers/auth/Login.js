// Library Imports
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {PermissionsAndroid} from 'react-native';

// Local Imports
import strings from '../../i18n/strings';
import {styles} from '../../themes';
import {getHeight, moderateScale} from '../../common/constants';
import ESafeAreaView from '../../components/common/ESafeAreaView';
import EInput from '../../components/common/EInput';
import {validateEmail} from '../../utils/validators';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import EButton from '../../components/common/EButton';
import api from '../../api/api';
import AuthContext from '../../navigation/Type/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import EText from '../../components/common/EText';
import {StackNav} from '../../navigation/NavigationKeys';
import messaging from '@react-native-firebase/messaging';
//import PushNotification from "react-native-push-notification";

const Login = () => {
  const navigation = useNavigation();

  const colors = useSelector(state => state.theme.theme);

  const BlurredStyle = {
    // backgroundColor: colors.inputBg,
    borderColor: colors.primary5,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary5,
  };

  const BlurredIconStyle = colors.primary5;
  const FocusedIconStyle = colors.primary5;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailIcon, setEmailIcon] = useState(BlurredIconStyle);
  const [passwordIcon, setPasswordIcon] = useState(BlurredIconStyle);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [emailInputStyle, setEmailInputStyle] = useState(BlurredStyle);
  const [passwordInputStyle, setPasswordInputStyle] = useState(BlurredStyle);
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const {signIn} = useContext(AuthContext);

  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
  const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);

  useEffect(() => {
    if (
      email.length > 0 &&
      password.length > 0 &&
      !emailError &&
      !passwordError
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [email, password, emailError, passwordError]);

  const onChangedEmail = val => {
    const {msg} = validateEmail(val.trim());
    setEmail(val.trim());
    setEmailError(msg);
  };
  const onChangedPassword = val => {
    // const {msg} = validatePassword(val.trim());
    setPassword(val.trim());
    // setPasswordError(msg);
  };

  const EmailIcon = () => {
    return <Ionicons name="mail" size={moderateScale(20)} color={'black'} />;
  };

  const onFocusEmail = () => {
    onFocusInput(setEmailInputStyle);
    onFocusIcon(setEmailIcon);
  };
  const onBlurEmail = () => {
    onBlurInput(setEmailInputStyle);
    onBlurIcon(setEmailIcon);
  };

  const PasswordIcon = () => (
    <Ionicons name="lock-closed" size={moderateScale(20)} color={'black'} />
  );

  const onFocusPassword = () => {
    onFocusInput(setPasswordInputStyle);
    onFocusIcon(setPasswordIcon);
  };
  const onBlurPassword = () => {
    onBlurInput(setPasswordInputStyle);
    onBlurIcon(setPasswordIcon);
  };
  const RightPasswordEyeIcon = () => (
    <TouchableOpacity
      onPress={onPressPasswordEyeIcon}
      style={localStyles.eyeIconContainer}>
      <Ionicons
        name={isPasswordVisible ? 'eye-off' : 'eye'}
        size={moderateScale(20)}
        color={'black'}
      />
    </TouchableOpacity>
  );
  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('fcm token', fcmToken);
    }
  };
  checkToken();
  async function subscribeToCountryTopic(country) {
    const topic = `country_${country}`;
    await messaging().subscribeToTopic(topic);
    console.log(`Subscribed to ${topic}`);
  }
  const getUser = async () => {
    let userData = await AsyncStorage.getItem('USER');
    userData = JSON.parse(userData);
    subscribeToCountryTopic(userData?.country);
    console.log(`userData`, userData);
  };

  //getUser();
  //subscribeToCountryTopic('IND');
  useEffect(() => {
    getUser();
  }, []);
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  // useEffect(()=>{
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {

  //     PushNotification.createChannel(
  //       {
  //         channelId: "channel-id",
  //         channelName: "My channel",
  //         channelDescription: "A channel to categorise your notifications",
  //         playSound: true,
  //         soundName: "default",
  //         importance: 2,
  //         vibrate: true,

  //       },

  //     );

  //   PushNotification.localNotification({
  //     channelId: "channel-id", //
  //     // channelName: "My channel",
  //     title: remoteMessage?.notification?.title,
  //     message: remoteMessage?.notification?.body,
  //     // picture: "https://www.example.tld/picture.jpg", // (optional) Display an picture with the notification, alias of bigPictureUrl for Android. default: undefined
  //     // userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
  //     playSound: true,
  //     soundName: "default",
  //     });
  //   });

  //   return unsubscribe;

  // },[])

  // Register background handler
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  const onPressSignWithPassword = async () => {
    api
      .post('/api/loginApp', {
        email: email,
        password: password,
      })
      .then(async res => {
        console.log('r', res.data.data);
        if (res && res.data.msg === 'Success') {
          await AsyncStorage.setItem('USER_TOKEN', 'loggedin');
          await AsyncStorage.setItem('USER', JSON.stringify(res.data.data));
          subscribeToCountryTopic(res.data.data?.country);
          signIn('124');
          RNRestart.Restart(); // Restart the application after successful sign-in
          // navigation.navigate(StackNav.HomeTab);
        } else {
          Alert.alert('Please Enter Correct Email and Password');
        }
      })
      .catch(() => {
        Alert.alert('Invalid Credentials');
      });
  };

  const onPressPasswordEyeIcon = () => setIsPasswordVisible(!isPasswordVisible);

  const onPressSignIn = () => {
    navigation.navigate(StackNav.SignUp);
  };
  const onPressForgotPass = () => {
    navigation.navigate(StackNav.ForgotPass);
  };
  const onPressBack = () => {
    navigation.navigate(StackNav.HomeTab);
  };
  return (
    <ESafeAreaView style={localStyles.root}>
      {/* <EHeader isHideBack/> */}
      <KeyBoardAvoidWrapper contentContainerStyle={{flex: 1}}>
        <ImageBackground
          source={require('../../assets/images/QuizPage.png')}
          style={localStyles.backgroundImage}>
          <View style={localStyles.mainContainer}>
            <View style={[{flex: 2}]}></View>

            <View style={[localStyles.loginBg, {flex: 3}]}>
              {/* 
              <Image
                style={localStyles.banner}
                //  source={require('../../assets/images/logo.jpeg')}
              /> */}

              <EInput
                placeHolder={strings.email}
                placeholderTextColor={colors.primary5}
                keyBoardType={'email-address'}
                _value={email}
                _errorText={emailError}
                errorStyle={colors.primary5}
                autoCapitalize={'none'}
                insideLeftIcon={() => <EmailIcon />}
                toGetTextFieldValue={onChangedEmail}
                inputContainerStyle={[
                  localStyles.inputContainerStyle,
                  emailInputStyle,
                ]}
                inputBoxStyle={[localStyles.inputBoxStyle]}
                _onFocus={onFocusEmail}
                onBlur={onBlurEmail}
              />

              <EInput
                placeHolder={strings.password}
                placeholderTextColor={colors.primary5}
                keyBoardType={'default'}
                _value={password}
                _errorText={passwordError}
                autoCapitalize={'none'}
                insideLeftIcon={() => <PasswordIcon />}
                toGetTextFieldValue={onChangedPassword}
                inputContainerStyle={[
                  localStyles.inputContainerStyle,
                  passwordInputStyle,
                ]}
                _isSecure={isPasswordVisible}
                inputBoxStyle={[localStyles.inputBoxStyle]}
                _onFocus={onFocusPassword}
                onBlur={onBlurPassword}
                rightAccessory={() => <RightPasswordEyeIcon />}
              />

              <EButton
                title={strings.Login}
                type={'S16'}
                color={isSubmitDisabled && colors.white}
                containerStyle={localStyles.signBtnContainer}
                onPress={onPressSignWithPassword}
                bgColor={isSubmitDisabled && colors.primary5}
              />

              <TouchableOpacity
                onPress={onPressSignIn}
                style={localStyles.signUpContainer}>
                <EText
                  type={'b16'}
                  color={colors.dark ? colors.grayScale7 : colors.grayScale5}>
                  {strings.dontHaveAccount}
                </EText>
                <EText type={'b16'} color={colors.primary5}>
                  {' '}
                  {strings.signUp}
                </EText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onPressForgotPass}
                style={localStyles.signUpContainer}>
                <EText
                  type={'b16'}
                  color={colors.dark ? colors.grayScale7 : colors.grayScale5}>
                  {strings.forgotPass}
                </EText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onPressBack}
                style={localStyles.signUpContainer}>
                <EText
                  type={'b16'}
                  color={colors.dark ? colors.grayScale7 : colors.grayScale5}>
                  {strings.BackToHome}
                </EText>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </KeyBoardAvoidWrapper>
    </ESafeAreaView>
  );
};

export default Login;

const localStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  signBtnContainer: {
    ...styles.center,
    width: '100%',
    ...styles.mv20,
    height: getHeight(60),
    borderRadius: 10,
  },
  inputContainerStyle: {
    height: getHeight(60),
    ...styles.ph15,
    borderBottomWidth: moderateScale(1.5),
    borderTopWidth: moderateScale(1.5),
    borderLeftWidth: moderateScale(1.5),
    borderRightWidth: moderateScale(1.5),
    borderRadius: 10,
    color: '#222',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  inputBoxStyle: {
    ...styles.ph15,
    color: '#222',
  },
  root: {
    flex: 3,
    justifyContent: 'center',
    flexDirection: 'column',
    alignContent: 'center',
    backgroundColor: 'white',
  },
  loginBg: {
    backgroundColor: '#fff',
    ...styles.ph20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingTop: 30,
  },
  banner: {
    width: '60%',
    height: '30%',
    alignSelf: 'flex-end',
  },
  signUpContainer: {
    ...styles.rowCenter,
    ...styles.mb20,
  },
});
