// Library import
import {Image, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local import
import EHeader from '../../components/common/EHeader';
import strings from '../../i18n/strings';
import images from '../../assets/images';
import {styles} from '../../themes';
import {getHeight, moderateScale} from '../../common/constants';
import EText from '../../components/common/EText';
import EInput from '../../components/common/EInput';
import EButton from '../../components/common/EButton';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import EDivider from '../../components/common/EDivider';
import ESafeAreaView from '../../components/common/ESafeAreaView';
import {StackNav} from '../../navigation/NavigationKeys';

export default function Location({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  const BlurredStyle = {
    backgroundColor: colors.inputBg,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary5,
  };

  const BlurredIconStyle = colors.textColor;
  const FocusedIconStyle = colors.primary5;

  const [addressDetail, setAddressDetail] = useState('');
  const [addDetailStyle, setAddDetailStyle] = useState(BlurredStyle);
  const [addressIcon, setAddressIcon] = useState(BlurredIconStyle);

  const onFocusAddDetail = () => {
    setAddressIcon(FocusedIconStyle);
    setAddDetailStyle(FocusedStyle);
  };
  const onBlurAddNDetail = () => {
    setAddressIcon(BlurredIconStyle);
    setAddDetailStyle(BlurredStyle);
  };

  const onChangeAddDetail = text => setAddressDetail(text);

  const onPressAdd = () => navigation.navigate(StackNav.ScanId);

  const RightIcon = () => {
    return (
      <Ionicons
        name={'location-sharp'}
        size={moderateScale(24)}
        color={addressIcon}
      />
    );
  };

  return (
    <ESafeAreaView>
      <EHeader title={strings.setLocation} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={styles.flex}>
          <Image
            resizeMode="cover"
            source={colors.dark ? images.mapDark : images.mapLight}
            style={localStyles.mapImage}
          />
        </View>
        <View
          style={[
            localStyles.bottomContainer,
            {backgroundColor: colors.backgroundColor},
          ]}>
          <View
            style={[
              localStyles.indicatorStyle,
              {backgroundColor: colors.dark ? colors.dark3 : colors.grayScale3},
            ]}
          />
          <EText
            type={'B20'}
            style={localStyles.titleContainer}
            align={'center'}>
            {strings.location}
          </EText>
          <EDivider style={styles.mv10} />
          <EInput
            placeHolder={strings.enterLocation}
            _value={addressDetail}
            autoCapitalize={'none'}
            toGetTextFieldValue={onChangeAddDetail}
            inputContainerStyle={[
              {backgroundColor: colors.inputBg},
              localStyles.inputContainerStyle,
              addDetailStyle,
            ]}
            inputBoxStyle={[localStyles.inputBoxStyle]}
            _onFocus={onFocusAddDetail}
            onBlur={onBlurAddNDetail}
            rightAccessory={() => <RightIcon />}
          />
          <EDivider style={styles.mv15} />
          <EButton
            title={strings.continue}
            type={'S16'}
            color={colors.white}
            containerStyle={styles.mv10}
            onPress={onPressAdd}
          />
        </View>
      </KeyBoardAvoidWrapper>
    </ESafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  mapImage: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    ...styles.ph20,
  },
  titleContainer: {
    ...styles.p20,
  },
  checkboxContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.mt20,
  },
  inputContainerStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    ...styles.ph10,
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
  indicatorStyle: {
    width: moderateScale(60),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    ...styles.mt10,
    ...styles.selfCenter,
  },
});
