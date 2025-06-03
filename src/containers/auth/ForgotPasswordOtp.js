// Library import
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import CountDown from 'react-native-countdown-component';

// Local import
import ESafeAreaView from '../../components/common/ESafeAreaView';
import EHeader from '../../components/common/EHeader';
import strings from '../../i18n/strings';
import EText from '../../components/common/EText';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import {styles} from '../../themes';
import {getHeight, moderateScale} from '../../common/constants';
import {StackNav} from '../../navigation/NavigationKeys';
import typography from '../../themes/typography';
import EButton from '../../components/common/EButton';

const ForgotPasswordOtp = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);
  const [otp, setOtp] = useState('');
  const [counterId, setCounterId] = useState('1');
  const [isTimeOver, setIsTimeOver] = useState(false);

  const onOtpChange = code => setOtp(code);
  const onPressVerify = () => navigation.navigate(StackNav.CreateNewPassword);

  const onFinishTimer = () => setIsTimeOver(true);

  const onPressResend = () => {
    setCounterId(counterId + '1');
    setIsTimeOver(false);
    setOtp('');
  };

  return (
    <ESafeAreaView>
      <EHeader title={strings.forgotPassword} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={localStyles.root}>
          <EText type={'r18'} align={'center'} style={styles.mb20}>
            {strings.codeSendOn}
          </EText>
          <OTPInputView
            pinCount={4}
            code={otp}
            onCodeChanged={onOtpChange}
            autoFocusOnLoad={false}
            codeInputFieldStyle={[
              localStyles.pinInputStyle,
              {
                color: colors.textColor,
                backgroundColor: colors.inputBg,
                borderColor: colors.bColor,
              },
            ]}
            codeInputHighlightStyle={{
              borderColor: colors.primary5,
              backgroundColor: colors.inputFocusColor,
            }}
            style={localStyles.inputStyle}
            secureTextEntry={true}
          />
          <View style={styles.rowCenter}>
            {isTimeOver ? (
              <TouchableOpacity
                onPress={onPressResend}
                disabled={isTimeOver ? false : true}
                style={styles.p5}>
                <EText type={'m18'} align={'center'}>
                  {strings.resendCode}
                </EText>
              </TouchableOpacity>
            ) : (
              <View style={styles.rowCenter}>
                <EText type={'m18'} color={colors.grayScale3} align={'center'}>
                  {strings.resendCodeIn}
                </EText>
                <CountDown
                  id={counterId}
                  until={30}
                  onFinish={onFinishTimer}
                  digitStyle={{backgroundColor: colors.backgroundColor}}
                  digitTxtStyle={[
                    localStyles.digitStyle,
                    {color: colors.textColor},
                  ]}
                  timeToShow={['S']}
                  timeLabels={{m: null, s: null}}
                />
                <EText type={'m18'} color={colors.grayScale3} align={'center'}>
                  {strings.second}
                </EText>
              </View>
            )}
          </View>
        </View>
        <EButton
          type={'S16'}
          title={strings.verify}
          onPress={onPressVerify}
          containerStyle={localStyles.btnContainerStyle}
        />
      </KeyBoardAvoidWrapper>
    </ESafeAreaView>
  );
};

export default ForgotPasswordOtp;

const localStyles = StyleSheet.create({
  root: {
    ...styles.ph30,
    ...styles.justifyCenter,
    ...styles.flex,
  },
  pinInputStyle: {
    height: getHeight(60),
    width: moderateScale(75),
    fontSize: moderateScale(26),
    borderRadius: moderateScale(15),
  },
  btnContainerStyle: {
    ...styles.mh20,
    ...styles.mv10,
  },
  inputStyle: {
    height: getHeight(60),
    ...styles.mv30,
  },
  digitStyle: {
    fontSize: moderateScale(18),
    ...typography.fontWeights.Regular,
  },
});
