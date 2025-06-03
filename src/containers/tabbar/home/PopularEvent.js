import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';

// Custom Imports
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import EHeader from '../../../components/common/EHeader';
import strings from '../../../i18n/strings';
import {styles} from '../../../themes';
import {StackNav} from '../../../navigation/NavigationKeys';
import {Search_Dark, Search_Light} from '../../../assets/svgs';
import MostPopularCategory from '../../../components/homeComponent/MostPopularCategory';
import SmallCardComponent from '../../../components/homeComponent/SmallCardComponent';
import {popularEventData} from '../../../api/constant';
import {View} from 'react-native';

export default function PopularEvent({navigation}) {
  const colors = useSelector(state => state.theme.theme);
  const [extraData, setExtraData] = useState(true);
  const onPressSearch = () => navigation.navigate(StackNav.Search);

  useEffect(() => {
    setExtraData(!extraData);
  }, [colors]);

  const RightIcon = useMemo(() => {
    return (
      <TouchableOpacity style={styles.ph10} onPress={onPressSearch}>
        {colors.dark ? <Search_Dark /> : <Search_Light />}
      </TouchableOpacity>
    );
  }, []);

  const renderVerticalItem = ({item, index}) => {
    return <SmallCardComponent item={item} index={index} />;
  };

  const HeaderComponent = () => {
    return <MostPopularCategory />;
  };

  return (
    <ESafeAreaView>
      <EHeader title={strings.popularEvent} rightIcon={RightIcon} />
      <View style={localStyles.contentContainerStyle}>
        <FlashList
          data={popularEventData}
          extraData={extraData}
          renderItem={renderVerticalItem}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          estimatedItemSize={10}
          ListHeaderComponent={<HeaderComponent />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ESafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.ph20,
    ...styles.pb20,
    flex: 1,
  },
});
