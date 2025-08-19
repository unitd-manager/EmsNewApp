// Library Imports
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Marquee from './Marquee';
import {useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import {StackNav} from '../../../navigation/NavigationKeys';
import {useNavigation} from '@react-navigation/native';
import Swiper from 'react-native-swiper';

// Custom Imports
import {styles} from '../../../themes';
import CarouselCardItem, {
  SLIDER_WIDTH,
} from '../../../components/CarouselCardItem';
import SmallCardComponent from '../../../components/homeComponent/SmallCardComponent';
import EText from '../../../components/common/EText';
import EHeader from '../../../components/common/EHeader';
import api from '../../../api/api';
import imageBase from '../../../api/imageBase';

const HomeTab = () => {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();
  const [extraData, setExtraData] = useState(true);
  const [index, setIndex] = useState(0);
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
      <EHeader title="Egathuva Meignana Sabai (EMS)" style={{zIndex: 1, position: 'absolute', top: 0}} />
      <FlashList
        data={menu}
        extraData={extraData}
        renderItem={renderCategoryItem}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={10}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[localStyles.contentContainerStyle, {paddingTop: 80}]}
        ListHeaderComponent={() => (
          <>
            <View>
              <Text style={[localStyles.UserText, {marginTop: 0}]}>Welcome {userName}</Text>
            </View>

            {/* Banner Carousel using Swiper */}
            <View style={{height: 190, marginTop: 0}}>
              {datas.length > 0 && (
                <Swiper
                  autoplay
                  autoplayTimeout={4}
                  showsPagination
                  dotColor="#ccc"
                  activeDotColor={colors.primary}
                  loop
                  onIndexChanged={i => setIndex(i)}>
                  {datas.map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      activeOpacity={0.9}
                      style={{width: SLIDER_WIDTH, height: 80}}>
                      <Image
                        style={{
                        width: '99%',
                      height: 120,
                      marginTop: 5,
                      borderRadius: 8,
                      marginLeft: 2,
                        }}
                        source={{
                          uri: `${imageBase}${item.file_name}`,
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </Swiper>
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
  fancyText: {
    alignSelf: 'center',
  },
  UserText: {
    color: '#52316C',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
});
