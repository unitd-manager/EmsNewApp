import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';

// Custom Imports
import {styles} from '../../themes';
import EText from './EText';
import {moderateScale} from '../../common/constants';

const EHeader = props => {
  const {title, onPressBack, rightIcon, isHideBack, isLeftIcon} = props;
  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);

  const goBack = () => navigation.goBack();
  return (
    <View style={[localStyles.container, !!isHideBack && styles.pr10]}>
     
        
        {!isHideBack && (
          <TouchableOpacity style={styles.pr10} onPress={onPressBack || goBack}>
            <Feather
              name="arrow-left"
              size={moderateScale(26)}
              color={'#fff'}
            />
          </TouchableOpacity>
        )}
        {!!isLeftIcon && isLeftIcon}

        <EText
          numberOfLines={1}
          style={[styles.pr10, styles.mr10,{color:'#fff'}]}
          type={'B16'}>
          {title}
        </EText>
     
      {!!rightIcon && rightIcon}
    </View>
  );
};

export default memo(EHeader);

const localStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    ...styles.ph20,
    ...styles.pv15,
    backgroundColor:'#532c6d',
    paddingTop:'40',
    bottom: 0,
    width: '100%',
    zIndex: 1,
    top: undefined
  },
});
