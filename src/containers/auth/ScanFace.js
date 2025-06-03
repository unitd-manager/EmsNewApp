import {ImageBackground, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';

// Local import
import EHeader from '../../components/common/EHeader';
import {styles} from '../../themes';
import images from '../../assets/images';
import EText from '../../components/common/EText';
import strings from '../../i18n/strings';
import EButton from '../../components/common/EButton';
import SuccessModal from '../../components/models/SuccessModal';
import {StackNav} from '../../navigation/NavigationKeys';

export default function ScanFace({navigation}) {
  const colors = useSelector(state => state.theme.theme);
  const [modalVisible, setModalVisible] = useState(false);

  const onPressModalClose = () => setModalVisible(false);

  const onPressContinue = () =>
    navigation.reset({
      index: 0,
      routes: [{name: StackNav.TabBar}],
    });

  const onPressSkip = () => setModalVisible(true);

  return (
    <ImageBackground source={images.userPic} style={localStyles.imgStyle}>
      <EHeader />
      <View style={localStyles.root}>
        <View>
          <EText
            type={'B32'}
            color={colors.white}
            style={localStyles.titleContainer}
            align={'center'}>
            {strings.faceRecognition}
          </EText>
          <EText
            type={'r16'}
            color={colors.white}
            style={localStyles.titleContainer}
            align={'center'}>
            {strings.faceRecognitionDesc}
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
      </View>
      <SuccessModal
        visible={modalVisible}
        onPressModalClose={onPressModalClose}
      />
    </ImageBackground>
  );
}

const localStyles = StyleSheet.create({
  imgStyle: {
    ...styles.flex,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  titleContainer: {
    ...styles.mt15,
    ...styles.mh20,
  },
  root: {
    ...styles.flex,
    ...styles.justifyBetween,
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
