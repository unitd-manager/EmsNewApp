import {ImageBackground, StyleSheet, View} from 'react-native';
import React from 'react';
import {FlashList} from '@shopify/flash-list';
import {concertImageData} from '../../api/constant';
import {getHeight, moderateScale} from '../../common/constants';
import {commonColor, styles} from '../../themes';
import EText from '../common/EText';

export default function GalleryPreEventComponent({isMore = false}) {
  const RenderImageItem = ({item, index}) => {
    return (
      <View style={localStyles.imageContainer}>
        <ImageBackground
          source={{uri: item?.imageUrl}}
          imageStyle={{borderRadius: moderateScale(8)}}
          style={localStyles.imageStyle}>
          {!isMore && item?.id == '3' && (
            <View style={localStyles.moreItemContainer}>
              <EText type={'b18'} color={commonColor.white}>
                {'+14'}
              </EText>
            </View>
          )}
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={styles.flex}>
      <FlashList
        data={isMore ? concertImageData : concertImageData.slice(0, 3)}
        renderItem={RenderImageItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={10}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  imageContainer: {
    ...styles.flex,
    margin: moderateScale(5),
    overflow: 'hidden',
  },
  imageStyle: {
    width: '100%',
    height: getHeight(120),
    resizeMode: 'cover',
  },
  moreItemContainer: {
    ...styles.flex,
    backgroundColor: 'rgba(0,0,0,0.5)',
    ...styles.center,
    borderRadius: moderateScale(8),
  },
});
