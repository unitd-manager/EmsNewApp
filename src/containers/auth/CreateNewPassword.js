// Librairies import
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';

// Local import
import ESafeAreaView from '../../components/common/ESafeAreaView';
import EHeader from '../../components/common/EHeader';
import strings from '../../i18n/strings';
import {styles} from '../../themes';
import EText from '../../components/common/EText';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import {getHeight, moderateScale} from '../../common/constants';
import EInput from '../../components/common/EInput';
import {
  validateConfirmPassword,
  validatePassword,
} from '../../utils/validators';
import SuccessModal from '../../components/models/SuccessModal';
import EButton from '../../components/common/EButton';
import {NewPassWordDark, NewPassWordLight} from '../../assets/svgs';

const CreateNewPassword = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);

  const BlurredStyle = {
    backgroundColor: colors.inputBg,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary5,
  };

  const BlurredIconStyle = colors.grayScale5;
  const FocusedIconStyle = colors.primary5;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [passwordInputStyle, setPasswordInputStyle] = useState({});
  const [confirmPasswordInputStyle, setConfirmPasswordInputStyle] = useState(
    {},
  );
  const [passwordIcon, setPasswordIcon] = useState(BlurredIconStyle);
  const [confirmPasswordIcon, setConfirmPasswordIcon] =
    useState(BlurredIconStyle);
  const [isCheck, setIsCheck] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
  const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);

  const PasswordIcon = ({iconColor}) => (
    <Ionicons name="lock-closed" size={moderateScale(20)} color={iconColor} />
  );

  const onFocusPassword = () => {
    onFocusInput(setPasswordInputStyle);
    onFocusIcon(setPasswordIcon);
  };
  const onBlurPassword = () => {
    onBlurInput(setPasswordInputStyle);
    onBlurIcon(setPasswordIcon);
  };
  const RightPasswordEyeIcon = ({visible, onPress, iconColor}) => (
    <TouchableOpacity onPress={onPress} style={localStyles.eyeIconContainer}>
      <Ionicons
        name={visible ? 'eye-off' : 'eye'}
        size={moderateScale(20)}
        color={iconColor}
      />
    </TouchableOpacity>
  );

  const onPressPasswordEyeIcon = () => setIsPasswordVisible(!isPasswordVisible);
  const onPressConfirmPasswordEyeIcon = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  const onChangedPassword = val => {
    const {msg} = validatePassword(val.trim());
    setPassword(val.trim());
    setPasswordError(msg);
  };

  const onChangedConfirmPassword = val => {
    const {msg} = validateConfirmPassword(val.trim(), password);
    setConfirmPassword(val.trim());
    setConfirmPasswordError(msg);
  };

  const onFocusConfirmPassword = () => {
    onFocusInput(setConfirmPasswordInputStyle);
    onFocusIcon(setConfirmPasswordIcon);
  };
  const onBlurConfirmPassword = () => {
    onBlurInput(setConfirmPasswordInputStyle);
    onBlurIcon(setConfirmPasswordIcon);
  };

  const onPressContinue = () => {
    setModalVisible(true);
    // navigation.navigate(StackNav.Login);
  };
  const onPressModalClose = () => setModalVisible(false);

  return (
    <ESafeAreaView>
      <EHeader title={strings.createNewPassword} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={localStyles.root}>
          <View style={[styles.mt40, styles.selfCenter]}>
            {colors.dark ? (
              <NewPassWordDark
                width={moderateScale(200)}
                height={getHeight(190)}
              />
            ) : (
              <NewPassWordLight
                width={moderateScale(200)}
                height={getHeight(190)}
              />
            )}
          </View>
          <EText type={'m20'} style={styles.mt30}>
            {strings.createYourNewPassword}
          </EText>
          <EInput
            placeHolder={strings.password}
            keyBoardType={'default'}
            _value={password}
            _errorText={passwordError}
            autoCapitalize={'none'}
            insideLeftIcon={() => <PasswordIcon iconColor={passwordIcon} />}
            toGetTextFieldValue={onChangedPassword}
            inputContainerStyle={[
              {backgroundColor: colors.inputBg},
              localStyles.inputContainerStyle,
              passwordInputStyle,
            ]}
            _isSecure={isPasswordVisible}
            inputBoxStyle={[localStyles.inputBoxStyle]}
            _onFocus={onFocusPassword}
            onBlur={onBlurPassword}
            rightAccessory={() => (
              <RightPasswordEyeIcon
                visible={isPasswordVisible}
                onPress={onPressPasswordEyeIcon}
                iconColor={passwordIcon}
              />
            )}
          />
          <EInput
            placeHolder={strings.confirmNewPassword}
            keyBoardType={'default'}
            _value={confirmPassword}
            _errorText={confirmPasswordError}
            autoCapitalize={'none'}
            insideLeftIcon={() => (
              <PasswordIcon iconColor={confirmPasswordIcon} />
            )}
            toGetTextFieldValue={onChangedConfirmPassword}
            inputContainerStyle={[
              {backgroundColor: colors.inputBg},
              localStyles.inputContainerStyle,
              confirmPasswordInputStyle,
            ]}
            _isSecure={isConfirmPasswordVisible}
            inputBoxStyle={[localStyles.inputBoxStyle]}
            _onFocus={onFocusConfirmPassword}
            onBlur={onBlurConfirmPassword}
            rightAccessory={() => (
              <RightPasswordEyeIcon
                visible={isConfirmPasswordVisible}
                onPress={onPressConfirmPasswordEyeIcon}
                iconColor={confirmPasswordIcon}
              />
            )}
          />
        </View>
      </KeyBoardAvoidWrapper>
      <EButton
        type={'S16'}
        title={strings.continue}
        onPress={onPressContinue}
        containerStyle={[styles.mh20, styles.mv10]}
      />
      <SuccessModal
        visible={modalVisible}
        onPressModalClose={onPressModalClose}
      />
    </ESafeAreaView>
  );
};

export default CreateNewPassword;

const localStyles = StyleSheet.create({
  root: {
    ...styles.ph20,
  },
  inputContainerStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    ...styles.ph15,
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
  checkboxContainer: {
    ...styles.rowCenter,
    ...styles.mb20,
  },
});
