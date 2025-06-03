import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

// Local import
import ESafeAreaView from '../../components/common/ESafeAreaView';
import EHeader from '../../components/common/EHeader';
import EText from '../../components/common/EText';
import strings from '../../i18n/strings';
import {styles} from '../../themes';
import {FaceRecognitionDark, FaceRecognitionLight} from '../../assets/svgs';
import {deviceWidth, moderateScale} from '../../common/constants';
import EButton from '../../components/common/EButton';
import {StackNav} from '../../navigation/NavigationKeys';

export default function FaceRecolonization({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  const onPressContinue = () => navigation.navigate(StackNav.ScanFace);
  return (
    <ESafeAreaView>
      <EHeader />
      <EText type={'B32'} style={localStyles.titleContainer} align={'center'}>
        {strings.faceRecognition}
      </EText>
      <EText type={'r16'} style={localStyles.titleContainer} align={'center'}>
        {strings.faceRecognitionDesc}
      </EText>
      <View style={localStyles.root}>
        {colors.dark ? (
          <FaceRecognitionDark
            width={deviceWidth - moderateScale(40)}
            height={'60%'}
          />
        ) : (
          <FaceRecognitionLight
            width={deviceWidth - moderateScale(40)}
            height={'60%'}
          />
        )}
      </View>
      <View style={localStyles.btnContainer}>
        <EButton
          title={strings.skip}
          type={'S16'}
          color={colors.dark ? colors.white : colors.primary5}
          containerStyle={localStyles.skipBtnContainer}
          bgColor={colors.dark3}
          // onPress={onPressSkip}
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
}

const localStyles = StyleSheet.create({
  titleContainer: {
    ...styles.mt15,
    ...styles.mh20,
  },
  root: {
    ...styles.flex,
    ...styles.center,
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
