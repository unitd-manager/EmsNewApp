import React from 'react';
import {View,Text, Image, StyleSheet} from 'react-native';
import { useRoute } from '@react-navigation/native';
import EHeader from '../../../components/common/EHeader';

const AudioFiles = () => {
  const route = useRoute();
return(
  <>
  <EHeader title={route.params.title}  />
  <View style={menuStyles.container}>
    <Image
        style={menuStyles.Img}
        source={require('../../../assets/images/splash.png')}
      />
  </View>
</>
)
}
export default AudioFiles;

const menuStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Img: {
    height: '100%',
    width: '100%',
  },
});
