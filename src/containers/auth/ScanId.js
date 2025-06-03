import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Fragment} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import {styles} from '../../themes';
import {deviceWidth, moderateScale} from '../../common/constants';
import EText from '../../components/common/EText';
import strings from '../../i18n/strings';
import images from '../../assets/images';
import {FileIcon, GalleryIcon, ScanIcon} from '../../assets/svgs';
import {StackNav} from '../../navigation/NavigationKeys';

export default function ScanId({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  const onPressScan = () => navigation.navigate(StackNav.SelfieWithId);

  const onPressBack = () => navigation.goBack();
  return (
    <Fragment>
      <SafeAreaView style={{backgroundColor: 'red'}} />
      <SafeAreaView
        style={[styles.flex, {backgroundColor: colors.borderColor}]}>
        <TouchableOpacity style={localStyles.backBtn} onPress={onPressBack}>
          <Ionicons
            name="arrow-back-outline"
            size={moderateScale(26)}
            color={colors.white}
          />
        </TouchableOpacity>
        <View style={styles.flex}>
          <EText
            type={'B32'}
            color={colors.white}
            style={localStyles.titleContainer}
            align={'center'}>
            {strings.photoIdCard}
          </EText>
          <EText
            type={'r16'}
            color={colors.white}
            style={localStyles.titleContainer}
            align={'center'}>
            {strings.photoIdDesc}
          </EText>
          <Image source={images.scanId} style={localStyles.imageStyle} />
        </View>

        <View style={localStyles.bottomContainer}>
          <TouchableOpacity>
            <GalleryIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mh15} onPress={onPressScan}>
            <ScanIcon />
          </TouchableOpacity>
          <TouchableOpacity>
            <FileIcon />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <SafeAreaView style={{backgroundColor: 'red'}} />
    </Fragment>
  );
}

const localStyles = StyleSheet.create({
  backBtn: {
    ...styles.ph20,
    ...styles.pv15,
  },
  titleContainer: {
    ...styles.mt15,
  },
  imageStyle: {
    width: deviceWidth - moderateScale(60),
    height: '60%',
    resizeMode: 'contain',
    ...styles.center,
    ...styles.selfCenter,
    ...styles.mt40,
  },
  bottomContainer: {
    ...styles.rowCenter,
    ...styles.mv20,
  },
});
