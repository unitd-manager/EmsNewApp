// Libraries import
import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';

// Local import
import ESafeAreaView from '../../components/common/ESafeAreaView';
import EHeader from '../../components/common/EHeader';
import strings from '../../i18n/strings';
import EText from '../../components/common/EText';
import {styles} from '../../themes';
import {FingerPrint, FingerPrintDark} from '../../assets/svgs';
import {StackNav} from '../../navigation/NavigationKeys';
import SuccessModal from '../../components/models/SuccessModal';
import EButton from '../../components/common/EButton';

const SetSecure = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);

  const onPressContinue = () => {
    navigation.navigate(StackNav.FaceRecolonization);
  };
  const onPressSkip = () => setModalVisible(true);

  return (
    <ESafeAreaView>
      <EHeader title={strings.setYourFingerprint} />
      <View style={localStyles.root}>
        <EText type={'r18'} align={'center'}>
          {strings.setYourFingerprintDesc1}
        </EText>
        {colors.dark ? (
          <FingerPrintDark style={styles.mv50} />
        ) : (
          <FingerPrint style={styles.mv50} />
        )}
        <EText type={'r18'} align={'center'}>
          {strings.setYourFingerprintDesc2}
        </EText>
      </View>
      <View style={localStyles.btnContainer}>
        <EButton
          title={strings.skip}
          type={'S16'}
          color={colors.dark ? colors.white : colors.primary5}
          containerStyle={localStyles.skipBtnContainer}
          bgColor={colors.dark3}
          onPress={onPressSkip}
        />
        <EButton
          title={strings.continue}
          type={'S16'}
          color={colors.white}
          containerStyle={localStyles.skipBtnContainer}
          onPress={onPressContinue}
        />
      </View>
    </ESafeAreaView>
  );
};

export default SetSecure;

const localStyles = StyleSheet.create({
  root: {
    ...styles.flexCenter,
    ...styles.ph25,
  },
  btnContainer: {
    ...styles.mh20,
    ...styles.mb10,
    ...styles.rowSpaceAround,
  },
  skipBtnContainer: {
    width: '45%',
  },
});
