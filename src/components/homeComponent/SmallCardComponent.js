import {
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Custom Imports
import EText from '../common/EText';
import {commonColor, styles} from '../../themes';
import {deviceWidth, moderateScale} from '../../common/constants';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../../api/api';
// import { ElevationLevels } from 'react-native-paper/lib/typescript/types';

export default function SmallCardComponent({item, user, index,getMenus}) {

  const navigation = useNavigation();
  const [userContactId, setUserContactId] = useState(null);
  
  console.log('item', item.section_title)

  useEffect(() => {
    const getUserCart = async () => {
      try {
        const userData = await AsyncStorage.getItem('USER');
        const user = JSON.parse(userData);
        setUserContactId(user?.contact_id || null);
        api
          .post('/contact/getContactsById', {
            contact_id: user?.contact_id || null,
          })
          .then(res => {
            const contactCri = res.data.data;
            // setUserContactId(contactCri[0].contact_id)      
          });
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
   
    getUserCart();
  
  }, []);

   
  console.log('userContactId', userContactId)

  const [englishTitle, tamilTitle] = (item?.section_title || '').split(' / ');

  if (!userContactId) {
    return (
      <>
        {item.section_title !== 'My Profile' && (
          <TouchableOpacity
            style={[
              localStyles.root,
              index % 2 === 0 ? styles.mr5 : styles.ml5,
              {backgroundColor: '#532c6d' ? '#532c6d' : '#532c6d'},
            ]}
            onPress={() => {
              navigation.navigate(item.routes, { item, user })
            }}>

            <Image
              source={{
                uri: `http://43.228.126.245/EMS-API2/storage/uploads/${item?.file_name}`,
              }}
              style={localStyles.imageStyle}>
            </Image>

            <EText
              type={'S16'}
              numberOfLines={1}
              style={localStyles.textStyle}>
              {englishTitle}
            </EText>
            <EText
              type={'S16'}
              numberOfLines={1}
              style={[localStyles.textStyle, {marginTop: 2}]}>
              {tamilTitle}
            </EText>
          </TouchableOpacity>
        )}
      </>
    );
  } else {
    return (
      <>
          <TouchableOpacity
            style={[
              localStyles.root,
              index % 2 === 0 ? styles.mr5 : styles.ml5,
              {backgroundColor: '#532c6d' ? '#532c6d' : '#532c6d'},
            ]}
            onPress={() => {
              navigation.navigate(item.routes, { item, user })
            }}>

            <Image
              source={{
                uri: `http://43.228.126.245/EMS-API2/storage/uploads/${item?.file_name}`,
              }}
              style={localStyles.imageStyle}>
            </Image>

            <EText
              type={'S16'}
              numberOfLines={1}
              style={localStyles.textStyle}>
              {englishTitle}
            </EText>
            <EText
              type={'S16'}
              numberOfLines={1}
              style={[localStyles.textStyle, {marginTop: 2}]}>
              {tamilTitle}
            </EText>
          </TouchableOpacity>
     
      </>
    );
  }
}

const localStyles = StyleSheet.create({
  root: {
    ...styles.p10,
    ...styles.flex,
    ...styles.shadowStyle,
    ...styles.justifyCenter,
    width: (deviceWidth - moderateScale(120)) / 2,
    ...styles.mt15,
    borderRadius: moderateScale(5),
  },
  imageStyle: {
    width: 50,
    height: 50,
    alignSelf:'center',
   resizeMode: 'cover',
  },
  textStyle: {
    ...styles.mt10,
    ...styles.flex,
    alignSelf:'center',
    fontSize:13,
    color:commonColor.white,
  },
  locationSubContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.flex,
  },
  locationContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mt10,
    ...styles.mb5,
  },
  freeContainer: {
    height: moderateScale(22),
    width: moderateScale(36),
    borderRadius: moderateScale(8),
    ...styles.selfEnd,
    ...styles.center,
    backgroundColor: commonColor.primary5,
    right: moderateScale(10),
    top: moderateScale(10),
  },
});
