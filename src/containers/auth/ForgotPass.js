// Library Imports
import { StyleSheet, View, TouchableOpacity, Alert, ImageBackground, Image } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'

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
import EText from '../../components/common/EText';
import { StackNav } from '../../navigation/NavigationKeys';

const ForgotPass = () => {
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

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [emailInputStyle, setEmailInputStyle] = useState(BlurredStyle);
    const [emailIcon, setEmailIcon] = useState(BlurredIconStyle);

    const onFocusInput = onHighlight => onHighlight(FocusedStyle);
    const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
    const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
    const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);

    useEffect(() => {
        if (
            email.length > 0 &&
            !emailError
        ) {
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }, [email, emailError]);

    const onChangedEmail = val => {
        const { msg } = validateEmail(val.trim());
        setEmail(val.trim());
        setEmailError(msg);
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

    const onPressSignWithPassword = async () => {
        api.post('/contact/forgotPass', {
            email: email,
        }).then(async (res) => {
            SendEmail(res.data.data);
        }).catch(() => {
            Alert.alert('Please verify the email address and try again.')
        })
    };


    const SendEmail = (emailData) => {

        const to = emailData[0].email;
        const subject = "Password";
        const password = emailData[0].pass_word;

        api
            .post('/commonApi/sendUseremailForgetPassword', {
                to,
                subject,
                password,
            })
            .then(response => {
                if (response.status === 200) {
                    Alert.alert('Password Sent successfully on your mail.');
                    navigation.navigate(StackNav.Login)
                } else {
                    console.error('Error');
                }
            });
    };

    const onPressSignIn = () => {
        navigation.navigate(StackNav.Login);
    };

    return (
        <ESafeAreaView style={localStyles.root}>
            {/* <EHeader isHideBack/> */}
            <KeyBoardAvoidWrapper contentContainerStyle={{ flex: 1 }}>
                <ImageBackground
                     source={require('../../assets/images/Quizp.png')}
                    style={localStyles.backgroundImage}
                >
                    <View style={localStyles.mainContainer}>

                        <View style={[{ flex: 2 }]}></View>

                        <View style={[localStyles.loginBg, { justifyContent: 'space-between' }]}>

                            {/* <Image
                                style={localStyles.banner}
                                // source={require('../../assets/images/logo.jpeg')}
                            /> */}
                            
                            <View>
                                <EText
                                    type={'b16'}
                                    color={colors.dark ? colors.grayScale7 : colors.primary5}>
                                    Enter Your Email
                                </EText>

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

                                <EButton
                                    title='Send'
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
                                        Back to Login
                                    </EText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ImageBackground>

            </KeyBoardAvoidWrapper>


        </ESafeAreaView>
    );
};

export default ForgotPass;

const localStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center'
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
        width: '60%',
        height: '30%',
        alignSelf: 'flex-end',
    },
    signUpContainer: {
        ...styles.rowCenter,
        ...styles.mb20,
    },
});