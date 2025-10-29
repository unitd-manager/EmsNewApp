// Library Imports
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Marquee from './Marquee';
import {useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import {StackNav} from '../../../navigation/NavigationKeys';
import {useNavigation} from '@react-navigation/native';
import {SwiperFlatList} from 'react-native-swiper-flatlist';

// Custom Imports
import {styles} from '../../../themes';
import SmallCardComponent from '../../../components/homeComponent/SmallCardComponent';
import EHeader from '../../../components/common/EHeader';
import api from '../../../api/api';
import imageBase from '../../../api/imageBase';
const { width: windowWidth } = Dimensions.get('window');

// ...inside your component's render/ListHeaderComponent:

const HomeTab = () => {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();
  const [extraData, setExtraData] = useState(true);
  const [menu, setMenu] = useState([]);
  const [datas, setBanner] = useState([]);
  const [marquee, setMarquee] = useState([]);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const getUserCart = async () => {
      try {
        const userData = await AsyncStorage.getItem('USER');
        const user = JSON.parse(userData);
        setUserName(user?.first_name || null);
        api
          .post('/contact/getContactsById', {
            contact_id: user?.first_name || null,
          })
          .then(res => {
            const contactCri = res.data.data;
            setUserName(contactCri[0]?.first_name);
          });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    getUserCart();
  }, []);

  useEffect(() => {
    setExtraData(!extraData);
  }, [colors]);

  useEffect(() => {
    getMenus();
    getBanner();
    getMarquee();
  }, []);

  const getMenus = () => {
    api
      .get('/section/getAppSectionMenu')
      .then(res => setMenu(res.data.data))
      .catch(error => console.log('Menu Error', error));
  };

  const getMarquee = () => {
    api
      .get('/setting/getSettingsForQuizInfoText')
      .then(res => setMarquee(res.data.data))
      .catch(error => console.log('Marquee Error', error));
  };

  const getBanner = () => {
    api
      .get('/content/getBanners')
      .then(res => setBanner(res.data.data))
      .catch(error => console.log('Banner Error', error));
  };

  const renderCategoryItem = ({item, index}) => {
    return <SmallCardComponent item={item} key={index} getMenus={getMenus} />;
  };

  const marqueeValue = marquee && marquee[0]?.value;

  return (
    <View style={[styles.flexGrow1, {backgroundColor: '#fafafa'}]}>
      <EHeader
        title="Egathuva Meignana Sabai (EMS)"
        style={{zIndex: 1, position: 'absolute', top: 0}}
      />

      <FlashList
        data={menu}
        extraData={extraData}
        renderItem={renderCategoryItem}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={10}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          localStyles.contentContainerStyle,
          {paddingTop: 80},
        ]}
        ListHeaderComponent={() => (
          <>
            <View>
              <Text style={[localStyles.UserText, {marginTop: 0}]}>
                Welcome {userName}
              </Text>
            </View>

            {/* Banner Carousel using SwiperFlatList */}
          {/* Banner Carousel */}

<View >
  {datas.length > 0 ? (
    <SwiperFlatList
      autoplay
      autoplayDelay={3}
      autoplayLoop
      showPagination
      paginationStyleItem={{ width: 8, height: 8 }}
      paginationActiveColor={colors.primary}
      paginationDefaultColor="#ccc"
      // optional: disable momentum to make slide snapping predictable
      disableGesture={false}
    >
      {datas.map((item, i) => {
        const imgUri = item.file_name.startsWith('http')
          ? item.file_name
          : `${imageBase}${item.file_name}`;

        return (
          // crucial: make each slide the full width of the swiper
          <View
            key={i}
            style={{
              width: windowWidth,          // <- important
              height: 200,                 // match parent height
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity activeOpacity={0.9} style={{ width: '100%', alignItems: 'center' }}>
              <Image
                source={{ uri: imgUri }}
                style={{
                  width: windowWidth * 0.92, // slightly inset for rounded corners
                  height: 110,
                  borderRadius: 8,
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>

            {/* optional debug/info text — remove in production */}
            <Text style={{ textAlign: 'center', fontSize: 10, color: '#fff'}}>
              {imgUri}
            </Text>
          </View>
        );
      })}
    </SwiperFlatList>
  ) : (
    <Text style={{ textAlign: 'center', marginTop: 20 }}>No banners found</Text>
  )}
</View>


            {/* Marquee */}
            <View style={{marginBottom: 20}}>
              <TouchableOpacity>
                <Marquee
                  text={marqueeValue}
                  onPress={() => navigation.navigate(StackNav.Quiz)}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      />
    </View>
  );
};

export default HomeTab;

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.ph10,
    ...styles.pb20,
  },
  UserText: {
    color: '#52316C',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});
