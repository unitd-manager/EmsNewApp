import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';

// Custom Imports
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import EHeader from '../../../components/common/EHeader';
import {styles} from '../../../themes';
import strings from '../../../i18n/strings';
import MostPopularCategory from '../../../components/homeComponent/MostPopularCategory';
import EText from '../../../components/common/EText';
import {
  HorizantalActive,
  HorizantalInActive,
  VerticalActive,
  VerticalInActive,
} from '../../../assets/svgs';
import SearchCardComponent from '../../../components/homeComponent/SearchCardComponent';
import SmallCardComponent from '../../../components/homeComponent/SmallCardComponent';
import {popularEventData} from '../../../api/constant';

const HeaderComponent = React.memo(({isVertical, onPressResize}) => {
  return (
    <View style={styles.mt10}>
      <MostPopularCategory />
      <View style={localStyles.subHeader}>
        <EText type={'b18'} style={styles.flex}>
          {'Sort by'}
        </EText>
        <View style={styles.flexRow}>
          <TouchableOpacity style={styles.mh10} onPress={onPressResize}>
            {!isVertical ? <VerticalActive /> : <VerticalInActive />}
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressResize}>
            {isVertical ? <HorizantalActive /> : <HorizantalInActive />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export default function Search({navigation}) {
  const colors = useSelector(state => state.theme.theme);
  const [extraData, setExtraData] = useState(true);
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    setExtraData(!extraData);
  }, [colors, isVertical]);

  const renderItem = ({item, index}) => {
    return <SearchCardComponent item={item} index={index} />;
  };

  const renderVerticalItem = ({item, index}) => {
    return <SmallCardComponent item={item} index={index} />;
  };

  const onPressResize = useCallback(() => {
    setIsVertical(!isVertical);
  }, [isVertical]);

  return (
    <ESafeAreaView>
      <EHeader title={strings.search} />
      <FlashList
        data={popularEventData}
        extraData={extraData}
        renderItem={isVertical ? renderVerticalItem : renderItem}
        numColumns={isVertical && 2}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={10}
        ListHeaderComponent={
          <HeaderComponent
            isVertical={isVertical}
            onPressResize={onPressResize}
          />
        }
        contentContainerStyle={localStyles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
      />
    </ESafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.ph20,
    ...styles.pb20,
  },
  subHeader: {
    ...styles.rowSpaceBetween,
    ...styles.mt15,
  },
});
