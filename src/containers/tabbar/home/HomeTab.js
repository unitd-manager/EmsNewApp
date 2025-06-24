// Library Imports
import { StyleSheet, View,Image,TouchableOpacity,Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Marquee from './Marquee';
import { useSelector } from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import {StackNav} from '../../../navigation/NavigationKeys';
import {useNavigation} from '@react-navigation/native';
// Custom Imports 
import { styles } from '../../../themes';
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from '../../../components/CarouselCardItem';
//import Carousel, { Pagination } from 'react-native-snap-carousel'
import SmallCardComponent from '../../../components/homeComponent/SmallCardComponent';
import EText from '../../../components/common/EText';
import EHeader from '../../../components/common/EHeader';
import api from '../../../api/api';

const HomeTab = () => {
  const colors = useSelector(state => state.theme.theme);
  const [extraData, setExtraData] = useState(true);
  const navigation = useNavigation();
  const [index, setIndex] = React.useState(0)
  const isCarousel = React.useRef(null)
  const MarqueeValue = [
   'This is a long text that will continuously scroll horizontally.',
  'This is a long text that will continuously scroll horizontally.',
  'This is a long text that will continuously scroll horizontally.'
  ];

  const data = [
    {
      imgUrl: require("../../../assets/images/banner.png"),
    },
    {
      imgUrl: require("../../../assets/images/banner1.png"),
    },
    {
      imgUrl: require("../../../assets/images/banner2.png"),
    },
    {
      imgUrl: require("../../../assets/images/banner3.jpg"),
    },
  ];

  
// getMenus
const [menu, setMenu] = useState()
const [datas, setBanner] = useState([])
const [marquee, setMarquee] = useState([])
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
          setUserName(contactCri[0].first_name)      
        });
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };
 
  getUserCart();

}, []);

  const getMenus = () => {
    api
      .get('/section/getSectionMenu')
      .then(res => {
        setMenu(res.data.data);
      })
      .catch(error => {
        console.log("error",error)
      });

  };
  const getMarquee = () => {
    api
      .get('/setting/getSettingsForQuizInfoText')
      .then(res => {
        setMarquee(res.data.data);
      })
      .catch(error => {
        console.log("error",error)
      });

  };
  const getBanner = () => {
    api
      .get('/content/getBanners')
      .then(res => {
        setBanner(res.data.data);
      })
      .catch(error => {
        console.log("error",error)
      });

  };

  useEffect(() => {
    setExtraData(!extraData);
  }, [colors]);

  useEffect(() => {
    getMenus();
    getBanner();
    getMarquee();
  }, []);

  const renderCategoryItem = ({item, index,}) => {
    return <SmallCardComponent item={item} key={index} getMenus={getMenus} />;
  };

  // useEffect(() => {
  //   const start = async () => {
  //     await TrackPlayer.setupPlayer();
  //     await TrackPlayer.add({
  //       id: '1',
  //       url: require('../../../assets/audios/audio.mp3'),
  //       title: 'slider',
  //       artwork: images.users75
  //     });
  //     await TrackPlayer.play();
  //   };

  //   start();
  // }, []);
const marqueeValue =marquee && marquee[0]?.value

  return (
    <View style={[styles.flexGrow1, { backgroundColor: '#fafafa'}]}>
        <EHeader title="Egathuva Meignana Sabai (EMS)" />
      <View>
        <Text style={localStyles.UserText}> Welcome {userName}</Text>
      </View>
         

        <View style={{  }}>
          <View style={{
            backgroundColor: '#fafafa',
            alignItems: 'center',
            justifyContent: 'center',
           paddingBottom: 0,
          }}>
            {/* <Carousel
             layout="tinder"
             layoutCardOffset={9}
             ref={isCarousel}
             data={datas} // Use datas array for Carousel
            renderItem={({ item }) => (
              <TouchableOpacity>
             <Image
               style={{ width:'99%', height: 120,marginTop:25,borderRadius:8,marginLeft:2 }}
              source={{ uri: `http://43.228.126.245/EMS-API2/storage/uploads/${item.file_name}` }}
               />
               </TouchableOpacity>
              )}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={ITEM_WIDTH}
              inactiveSlideShift={0}
              useScrollView={true}
              autoplay={true}
              autoplayInterval={6000}
              loop={true}
              onSnapToItem={(index) => setIndex(index)}              
              />
            
            <Pagination
              dotsLength={datas.length}
              activeDotIndex={index}
              carouselRef={isCarousel}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 0,
                backgroundColor: colors.primary
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
              tappableDots={true}
            /> */}
          </View>
        </View>
        <View style={{ marginBottom:10}} >
        <TouchableOpacity>
        <Marquee  text={marqueeValue} onPress={() => navigation.navigate(StackNav.Quiz)}/>
        </TouchableOpacity>
        </View>
      
      <FlashList
        data={menu}
        extraData={extraData}
        renderItem={renderCategoryItem}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={10}
        numColumns={2}
        // ListHeaderComponent={<RenderHeaderItem />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={localStyles.contentContainerStyle}
      />

    </View>
  );
}

export default HomeTab
const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.ph10,
    ...styles.pb20,
  },
  fancyText: {
    alignSelf:'center',
  },
  UserText: {
    color:'#52316C',
    marginLeft:10,
    marginTop:7,
    marginBottom:-4
  },
  
});
