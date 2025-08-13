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
      .get('/section/getSectionMenu')
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
      <EHeader title="Egathuva Meignana Sabai (EMS)" />
      <ScrollView>
        <View>
          <Text style={localStyles.UserText}>Welcome {userName}</Text>
        </View>

        {/* Banner Carousel using Swiper */}
        <View style={{height: 200}}>
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
                  style={{width: SLIDER_WIDTH, height: 180}}>
                  <Image
                    style={{
                      width: '99%',
                      height: 120,
                      marginTop: 25,
                      borderRadius: 8,
                      marginLeft: 2,
                    }}
                    source={{
                      uri: `http://43.228.126.245/EMS-API2/storage/uploads/${item.file_name}`,
                    }}
                  />
                </TouchableOpacity>
              ))}
            </Swiper>
          )}
        </View>

        {/* Marquee */}
        <View style={{marginBottom: 10}}>
          <TouchableOpacity>
            <Marquee
              text={marqueeValue}
              onPress={() => navigation.navigate(StackNav.Quiz)}
            />
          </TouchableOpacity>
        </View>

        {/* FlashList Grid */}
        <FlashList
          data={menu}
          extraData={extraData}
          renderItem={renderCategoryItem}
          keyExtractor={(item, index) => index.toString()}
          estimatedItemSize={10}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={localStyles.contentContainerStyle}
        />
      </ScrollView>
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
    marginLeft: 10,
    marginTop: 7,
    marginBottom: -4,
  },
});
