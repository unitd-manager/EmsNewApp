import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

// custom imports
import {styles} from '../../themes';
import {NotificationDark, NotificationLight} from '../../assets/svgs';
import EText from '../common/EText';
import {moderateScale} from '../../common/constants';
import {StackNav} from '../../navigation/NavigationKeys';

function HomeHeader() {
  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);

  const onPressNotification = () => navigation.navigate(StackNav.Notification);

  return (
    <View style={localStyles.headerContainer}>
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
        }}
        style={localStyles.userImageStyle}
      />
      <View style={localStyles.textContainer}>
        <EText type="m16" numberOfLines={1} color={colors.primaryTextColor}>
          Good Morning 👋
        </EText>
        <EText type="B20" numberOfLines={1} color={colors.primaryTextColor}>
          Andrew Ainsley
        </EText>
      </View>

      <TouchableOpacity
        onPress={onPressNotification}
        style={[
          localStyles.notificationContainer,
          {borderColor: colors.dark ? colors.grayScale8 : colors.grayScale3},
        ]}>
        {colors.dark ? <NotificationDark /> : <NotificationLight />}
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(HomeHeader);

const localStyles = StyleSheet.create({
  headerContainer: {
    ...styles.rowSpaceBetween,
    ...styles.flex,
    ...styles.mt15,
  },
  userImageStyle: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
  },
  textContainer: {
    ...styles.mh10,
    ...styles.flex,
  },
  notificationContainer: {
    ...styles.center,
    ...styles.ph10,
    ...styles.pv10,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(26),
  },
});
