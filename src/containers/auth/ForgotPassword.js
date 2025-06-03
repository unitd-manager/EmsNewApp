import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo, useState} from 'react';
import {useSelector} from 'react-redux';

// Custom Imports
import ESafeAreaView from '../../components/common/ESafeAreaView';
import EHeader from '../../components/common/EHeader';
import strings from '../../i18n/strings';
import {styles} from '../../themes';
import EText from '../../components/common/EText';
import {
  Email_Icon,
  ForgotPassword_Dark,
  ForgotPassword_Light,
  Sms_Icon,
} from '../../assets/svgs';
import {getHeight, moderateScale} from '../../common/constants';
import {StackNav} from '../../navigation/NavigationKeys';
import EButton from '../../components/common/EButton';

const ForgotPassword = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);
  const [isSelected, setIsSelected] = useState('sms');

  const onPressSms = () => {
    setIsSelected(isSelected === 'sms' ? '' : 'sms');
  };

  const onPressEmail = () => {
    setIsSelected(isSelected === 'email' ? '' : 'email');
  };

  const onPressPinContinue = () =>
    navigation.navigate(StackNav.ForgotPasswordOtp);

  const RenderMode = memo(({title, icon, msgId, onPress, isActive}) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          localStyles.mainContainer,
          {borderColor: isActive ? colors.primary5 : colors.bColor},
        ]}>
        {icon}
        <View style={[styles.ml20, styles.flex]}>
          <EText type={'m14'} color={colors.grayScale6}>
            {title}
          </EText>
          <EText style={styles.mt10} type={'b16'}>
            {msgId}
          </EText>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <ESafeAreaView>
      <EHeader title={strings.forgotPassword} />
      <ScrollView bounces={false} contentContainerStyle={localStyles.root}>
        <View style={[styles.mv20, styles.selfCenter]}>
          {colors.dark ? (
            <ForgotPassword_Dark
              width={moderateScale(200)}
              height={getHeight(190)}
            />
          ) : (
            <ForgotPassword_Light
              width={moderateScale(200)}
              height={getHeight(190)}
            />
          )}
        </View>
        <View>
          <EText type={'r18'} style={styles.mt30}>
            {strings.forgotPasswordDesc}
          </EText>
          <RenderMode
            title={strings.viaSms}
            icon={<Sms_Icon />}
            msgId="+1 233 456 78 90"
            onPress={() => onPressSms()}
            isActive={isSelected === 'sms'}
          />
          <RenderMode
            title={strings.viaEmail}
            icon={<Email_Icon />}
            msgId="qweew********1233@gmai.com"
            onPress={() => onPressEmail()}
            isActive={isSelected === 'email'}
          />
        </View>
      </ScrollView>
      <EButton
        type={'S16'}
        title={strings.continue}
        onPress={onPressPinContinue}
        containerStyle={localStyles.btnContainerStyle}
      />
    </ESafeAreaView>
  );
};

export default ForgotPassword;

const localStyles = StyleSheet.create({
  root: {
    ...styles.ph20,
    ...styles.justifyEnd,
    ...styles.flex,
  },
  mainContainer: {
    ...styles.p15,
    ...styles.flexRow,
    ...styles.mt20,
    ...styles.itemsCenter,
    borderWidth: moderateScale(2),
    borderRadius: moderateScale(30),
  },
  btnContainerStyle: {
    ...styles.mh20,
    ...styles.mb10,
    ...styles.mt20,
  },
});
