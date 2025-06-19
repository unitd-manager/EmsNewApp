// Library Imports
import { StyleSheet, View, TouchableOpacity, Alert, ImageBackground, Image } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Local Imports
import strings from '../../i18n/strings';
import { styles } from '../../themes';
import { getHeight, moderateScale } from '../../common/constants';
import ESafeAreaView from '../../components/common/ESafeAreaView';
import EInput from '../../components/common/EInput';
import { validateEmail } from '../../utils/validators';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import EButton from '../../components/common/EButton';
import api from '../../api/api';
import { useNavigation } from '@react-navigation/native'
import EText from '../../components/common/EText';
import { StackNav } from '../../navigation/NavigationKeys';

const SignUp = () => {
    const navigation = useNavigation()
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

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [conPassword, setConPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [namelIcon, setNameIcon] = useState(BlurredIconStyle);
    const [emailIcon, setEmailIcon] = useState(BlurredIconStyle);
    const [phoneIcon, setPhoneIcon] = useState(BlurredIconStyle);
    const [passwordIcon, setPasswordIcon] = useState(BlurredIconStyle);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [nameInputStyle, setNameInputStyle] = useState(BlurredStyle);
    const [emailInputStyle, setEmailInputStyle] = useState(BlurredStyle);
    const [phoneInputStyle, setPhoneInputStyle] = useState(BlurredStyle);
    const [passwordInputStyle, setPasswordInputStyle] = useState(BlurredStyle);
    const [conpasswordInputStyle, setConPasswordInputStyle] = useState(BlurredStyle);
    const [isPasswordVisible, setIsPasswordVisible] = useState(true);

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

    const isValidPassword = (password) => {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
        return passwordRegex.test(password);
      };
      

    // onChanged
    const onChangedName = val1 => {
        // const { msg } = validateEmail(val.trim());
        setName(val1.trim());
        // setEmailError(msg);
    };
    const onChangedEmail = val2 => {
        const { msg } = validateEmail(val2.trim());
        setEmail(val2.trim());
        setEmailError(msg);
    };
    const onChangedPhone = val3 => {
        // const { msg } = validateEmail(val.trim());
        setPhone(val3.trim());
        // setEmailError(msg);
    };
    const onChangedPassword = val4 => {
        // const {msg} = validatePassword(val.trim());
        setPassword(val4.trim());
        // setPasswordError(msg);
    };
    const onChangedConfirmPassword = val => {
        // const {msg} = validatePassword(val.trim());
        setConPassword(val.trim());
        // setPasswordError(msg);
    };

    const Insert = () => {
        if (!name || !email || !password || !phone || !conPassword) {
          Alert.alert('Please fill in all fields');
          return;
        }
      
        if (!isValidPassword(password)) {
          Alert.alert(
            'Weak Password',
            'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one special character, and one number.'
          );
          return;
        }
      
        if (password !== conPassword) {
          Alert.alert('Passwords do not match');
          return;
        }
      
        const registerData = {
          first_name: name,
          email: email,
          password: password,
          mobile: phone,
        };
      
        api
          .post('/api/register', registerData)
          .then(response => {
            if (response.status === 200) {
              setTimeout(() => {
                SendEmail();
              }, 500);
              Alert.alert('You have successfully registered');
              setTimeout(() => {
                navigation.navigate(StackNav.Login)
              }, 500);
            } else {
              console.error('Error');
            }
          })
          .catch(error => {
            setEmailError('Email is already registered');
          });
      };
      

    const SendEmail = () => {
        const to = email;
        const subject = "Login Registration";
        api
            .post('/commonApi/sendUseremailSignUp', { to, subject })
            .then(response => {
                if (response.status === 200) {
                    Alert.alert('You have successfully registered');
                    setTimeout(() => {
                        navigation.navigate(StackNav.Login)
                    }, 500);
                } else {
                    console.error('Error');
                }
            })
    }
    // Icons
    const EmailIcon = () => {
        return <Ionicons name="mail" size={moderateScale(20)} color={'black'} />;
    };
    const NameIcon = () => {
        return <FontAwesome name="user" size={moderateScale(20)} color={'black'} />;
    };
    const PhoneIcon = () => {
        return <FontAwesome name="phone" size={moderateScale(20)} color={'black'} />;
    };

    // Focus
    const onFocusName = () => {
        onFocusInput(setNameInputStyle);
        onFocusIcon(setNameIcon);
    };
    const onFocusEmail = () => {
        onFocusInput(setEmailInputStyle);
        onFocusIcon(setEmailIcon);
    };
    const onFocusPhone = () => {
        onFocusInput(setPhoneInputStyle);
        onFocusIcon(setPhoneIcon);
    };
    const onFocusPassword = () => {
        onFocusInput(setPasswordInputStyle);
        onFocusIcon(setPasswordIcon);
    };
    const onFocusConfPassword = () => {
        onFocusInput(setConPasswordInputStyle);
        onFocusIcon(setPasswordIcon);
    };

    // Blur
    const onBlurName = () => {
        onBlurInput(setNameInputStyle);
        onBlurIcon(setNameIcon);
    };
    const onBlurEmail = () => {
        onBlurInput(setEmailInputStyle);
        onBlurIcon(setEmailIcon);
    };
    const onBlurPhone = () => {
        onBlurInput(setPhoneInputStyle);
        onBlurIcon(setPhoneIcon);
    };
    const onBlurPassword = () => {
        onBlurInput(setPasswordInputStyle);
        onBlurIcon(setPasswordIcon);
    };
    const onBlurConPassword = () => {
        onBlurInput(setConPasswordInputStyle);
        onBlurIcon(setPasswordIcon);
    };


    const PasswordIcon = () => (
        <Ionicons
            name="lock-closed"
            size={moderateScale(20)}
            color={'black'}
        />
    );
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

    const onPressSignIn = () => {
        navigation.navigate(StackNav.Login);
    };

    const onPressPasswordEyeIcon = () => setIsPasswordVisible(!isPasswordVisible);

    return (
        <ESafeAreaView style={localStyles.root}>
            {/* <EHeader isHideBack/> */}
            <KeyBoardAvoidWrapper contentContainerStyle={{ flex: 1 }}>
                <ImageBackground
                     source={require('../../assets/images/1quiz.png')}
                    style={localStyles.backgroundImage}
                >
                    <View style={localStyles.mainContainer}>

                        <View style={[{ flex: 1 }]}></View>

                        <View style={[localStyles.loginBg, { flex: 3 }]}>

                            {/* <Image
                                style={localStyles.banner}
                                // source={require('../../assets/images/logo.jpeg')}
                            /> */}

                            <EInput
                                placeHolder="Name"
                                placeholderTextColor={colors.primary5}
                                keyBoardType={'default'}
                                _value={name}
                                // _errorText={emailError}
                                // errorStyle={colors.primary5}
                                autoCapitalize={'none'}
                                insideLeftIcon={() => <NameIcon />}
                                toGetTextFieldValue={onChangedName}
                                inputContainerStyle={[
                                    localStyles.inputContainerStyle,
                                    nameInputStyle,
                                ]}
                                inputBoxStyle={[localStyles.inputBoxStyle]}
                                _onFocus={onFocusName}
                                onBlur={onBlurName}
                            />

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
                                placeHolder="Phone"
                                placeholderTextColor={colors.primary5}
                                keyBoardType={'number'}
                                _value={phone}
                                // _errorText={emailError}
                                // errorStyle={colors.primary5}
                                autoCapitalize={'none'}
                                insideLeftIcon={() => <PhoneIcon />}
                                toGetTextFieldValue={onChangedPhone}
                                inputContainerStyle={[
                                    localStyles.inputContainerStyle,
                                    phoneInputStyle,
                                ]}
                                inputBoxStyle={[localStyles.inputBoxStyle]}
                                _onFocus={onFocusPhone}
                                onBlur={onBlurPhone}
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

                            <EInput
                                placeHolder="Confirm Password"
                                placeholderTextColor={colors.primary5}
                                keyBoardType={'default'}
                                _value={conPassword}
                                // _errorText={passwordError}
                                autoCapitalize={'none'}
                                insideLeftIcon={() => <PasswordIcon />}
                                toGetTextFieldValue={onChangedConfirmPassword}
                                inputContainerStyle={[
                                    localStyles.inputContainerStyle,
                                    conpasswordInputStyle,
                                ]}
                                _isSecure={isPasswordVisible}
                                inputBoxStyle={[localStyles.inputBoxStyle]}
                                _onFocus={onFocusConfPassword}
                                onBlur={onBlurConPassword}
                                rightAccessory={() => <RightPasswordEyeIcon />}
                            />

                            <EButton
                                title="SignUp"
                                type={'S16'}
                                color={isSubmitDisabled && colors.white}
                                containerStyle={localStyles.signBtnContainer}
                                onPress={(event) => {
                                    Insert(event)
                                }
                                }
                                bgColor={isSubmitDisabled && colors.primary5}
                            />

                            <TouchableOpacity
                                onPress={onPressSignIn}
                                style={localStyles.signUpContainer}>
                                <EText
                                    type={'b16'}
                                    color={colors.dark ? colors.grayScale7 : colors.grayScale5}>
                                    {strings.AlreadyHaveAccount}
                                </EText>
                                <EText type={'b16'} color={colors.primary5}>
                                    {' '}
                                    {strings.signIn}
                                </EText>
                            </TouchableOpacity>

                        </View>
                    </View>
                </ImageBackground>

            </KeyBoardAvoidWrapper>
        </ESafeAreaView>
    );
};

export default SignUp;

const localStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    signBtnContainer: {
        ...styles.center,
        width: '100%',
        ...styles.mv20,
        height: getHeight(80),
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
        color: '#222'
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    inputBoxStyle: {
        ...styles.ph15,
        color: '#222'
    },
    root: {
        flex: 3,
        justifyContent: 'center',
        flexDirection: 'column',
        alignContent: 'center',
        backgroundColor: 'white',
    },
    loginBg: {
        backgroundColor: "#fff",
        ...styles.ph20,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        paddingTop: 30
    },
    banner: {
        flex: 1,
        width: 150,
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'flex-end',
    },
    signUpContainer: {
        ...styles.rowCenter,
        ...styles.mb20,
    },
});