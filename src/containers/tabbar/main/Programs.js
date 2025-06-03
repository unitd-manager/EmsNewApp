import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { StackNav } from '../../../navigation/NavigationKeys';
import { useRoute,useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import EHeader from '../../../components/common/EHeader';
import api from '../../../api/api';
import AD from 'react-native-vector-icons/AntDesign';
import AboutCategoryDetail from './AboutCategoryDetail';

const ListFlat = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [manitha, setManitha] = useState([]);

  const [selectedItem, setSelectedItem] = React.useState();
  const [detailview, setDetailView] = React.useState(false);

  const handleItemPress = (id) => {
    api
      .post('/content/getDetailContent', { section_id: route.params.item.section_id, category_id: id })
      .then((res) => {
        setSelectedItem(res.data.data);
        const categoryId = res.data.data[0].content_type;
        console.log('Category ID:', categoryId);
        // Check category ID and navigate accordingly
        switch (res.data.data[0].content_type) {
          case 'Photo Gallery':
            console.log('Navigating to PhotoGallery');
            navigation.navigate(StackNav.PhotoGallery);
            break;
          case 'Audio Gallery':
            console.log('Navigating to ListScreen');
            navigation.navigate(StackNav.ListScreen);
            break;
          case 'Video Gallery':
            console.log('Navigating to VideoGallery');
            navigation.navigate(StackNav.VideoGallery);
            break;
          case 'Events Image':
            console.log('Navigating to Event');
            navigation.navigate(StackNav.Event);
            break;
          default:
            console.log('No valid category ID found');
        }
      })
      .catch((error) => {
        console.log('Error fetching client details by ID:', error);
      });
  };
  
  
  
  const onDismiss = async () => {
    setDetailView(false);
  }

  useEffect(() => {
    api
      .post('/category/getSectionsCategory', { section_id: route.params.item.section_id })
      .then((res) => {
        setManitha(res.data.data);
      })
      .catch((error) => {
        console.log('Error fetching client details by ID:', error);
      });
  }, []);


  const renderItem = ({ item }) => {

    return (
      <View style={styles.container} >
        <TouchableOpacity
          style={styles.itemContainer}
        >
          <LinearGradient
            style={styles.item}
            colors={['#fff', '#fff']}
            start={{ x: 0, y: 0.2 }}
            end={{ x: 1.5, y: 0.2 }}
          >
            <AD style={styles.arrowContainer} name="rightcircle" size={22} color="#532c6d" />
            <Text style={styles.title}
              onPress={() => {
                handleItemPress(item.category_id)
                 
              }}
            >{item.category_title}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <AboutCategoryDetail detailview={detailview} setDetailView={setDetailView} singleDetail={selectedItem} onDismiss={onDismiss}></AboutCategoryDetail>
      </View>
    );
  };
  return (
    <>

      <EHeader title={route.params.item.section_title} />

      <SafeAreaView style={styles.container}>
        <FlatList
          data={manitha}
          renderItem={renderItem}
          keyExtractor={(item) => item.category_id.toString()}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </SafeAreaView>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    height: 90,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  arrowContainer: {
    marginHorizontal: 10,
  },
  title: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    width: '90%'
  },
  itemContainer: {
    flex: 1,
    marginVertical: 15,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    customImage: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
      tintColor: '#fff',
    },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 10,
  },



});
export default ListFlat;