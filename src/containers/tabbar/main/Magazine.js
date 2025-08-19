import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import imageBase from '../../../api/imageBase';
import api from '../../../api/api';
import { StackNav } from '../../../navigation/NavigationKeys';
import AboutCategoryDetail from './AboutCategoryDetail';
import EHeader from '../../../components/common/EHeader';
import { Picker } from '@react-native-picker/picker';

const ListFlat = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailview, setDetailView] = useState(false);
  const [userContactId, setUserContactId] = useState(null);
  const [userContactStatus, setUserContactStatus] = useState(null);
  const [selectedItem, setSelectedItem] = useState();
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [areaFilter, setAreaFilter] = useState(null);
  const [cateOptions, setcateOption] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [valuelistCountry, setValuelistCountry] = useState([]);

  useEffect(() => {
    const getUserCart = async () => {
      try {
        const userData = await AsyncStorage.getItem('USER');
        const user = JSON.parse(userData);

        if (!user?.contact_id) {
          Alert.alert('Please Login!');
          navigation.reset({
            index: 0,
            routes: [{ name: StackNav.HomeTab }],
          });
          return;
        }

        const res = await api.post('/contact/getContactsById', {
          contact_id: user.contact_id,
        });

        const contact = res.data.data?.[0];

        if (!contact) {
          Alert.alert('User not found!');
          navigation.reset({
            index: 0,
            routes: [{ name: StackNav.HomeTab }],
          });
          return;
        }

        setUserContactId(contact.contact_id);
        setUserContactStatus(contact.subs_payment_status);

        if (contact.subs_payment_status !== 'subscribe') {
          Alert.alert('Magazine access restricted. Please subscribe!');
          navigation.reset({
            index: 0,
            routes: [{ name: StackNav.Payment }],
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getUserCart();
  }, []);

  // Prevent back button if not subscribed
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (userContactStatus !== 'subscribe') {
        Alert.alert('Access denied', 'You need a valid subscription.');
        return true; // block back
      }
      return false;
    });
    return () => backHandler.remove();
  }, [userContactStatus]);

  const handleItemPress = (id) => {
    api
      .post('/content/getArticleByMagazineId', { magazine_id: id })
      .then((res) => {
        setSelectedItem(res.data.data);
        navigation.navigate(StackNav.Articles, { magazineId: id });
      })
      .catch((error) => {
        console.log('Error fetching details:', error);
      });
  };

  const fetchGalleryCatecory = () => {
    api.get('/content/getMagazineYear')
      .then((res) => setcateOption(res.data.data))
      .catch((error) => console.log('Error fetching years:', error));
  };

  const getValuelistCountry = () => {
    api.get('/content/getMagazineMonth')
      .then((res) => setValuelistCountry(res.data.data))
      .catch((error) => console.log('Months not found:', error));
  };

  const applyFilters = () => {
    let filteredData = [...clients];
    if (categoryFilter) {
      filteredData = filteredData.filter(item => item.year === categoryFilter);
    }
    if (areaFilter) {
      filteredData = filteredData.filter(item => item.month === areaFilter);
    }
    if (searchQuery) {
      filteredData = filteredData.filter(item =>
        (item.search_keyword && item.search_keyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return filteredData;
  };

  useEffect(() => {
    fetchGalleryCatecory();
    getValuelistCountry();
    setLoading(true);
    api.get('/content/getMagazine')
      .then((res) => {
        res.data.data.forEach((element) => {
          element.tag = String(element.tag).split(',');
        });
        setClients(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching magazines:', error);
        setLoading(false);
      });
  }, []);

  const filteredGallery = applyFilters();

  if (userContactStatus !== 'subscribe') {
    return null; // prevent showing anything if access not granted
  }

  return (
    <>
      <EHeader title={route.params.item.section_title} />
      <View style={styles.filtersContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoryFilter}
            dropdownIconColor="#52316C"
            onValueChange={(itemValue) => setCategoryFilter(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Select Year" value="" />
            {cateOptions.map((item) => (
              <Picker.Item key={item.year} label={item.year} value={item.year} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer1}>
          <Picker
            selectedValue={areaFilter}
            dropdownIconColor="#52316C"
            onValueChange={(itemValue) => setAreaFilter(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Select Month" value="" />
            {valuelistCountry.map((item) => (
              <Picker.Item key={item.name} label={item.month} value={item.name} />
            ))}
          </Picker>
        </View>
      </View>

      {(categoryFilter || areaFilter) && (
        <TouchableOpacity onPress={() => {
          setCategoryFilter(null);
          setAreaFilter(null);
        }} style={styles.clearButtonContainer}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        placeholderTextColor="black"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={filteredGallery}
              horizontal={false}
              numColumns={1}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.card}
                  onPress={() => handleItemPress(item.magazine_id)}>
                  <Image
                    style={styles.tinyLogo}
                    source={{ uri: `${imageBase}${item.file_name}` }}
                  />
                  <Text style={styles.titleText}>{item.title}</Text>
                </Pressable>
              )}
              keyExtractor={item => item.id}
            />
          )}
        </ScrollView>
        <AboutCategoryDetail detailview={detailview} setDetailView={setDetailView} singleDetail={selectedItem} onDismiss={() => setDetailView(false)} />
      </View>
    </>
  );
};

export default ListFlat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    marginLeft: -5,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 1,
  },
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    marginLeft: 10,
    width: 180,
    height: 40,
    justifyContent: 'center',
  },
  pickerContainer1: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    marginRight: 10,
    width: 180,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    color: 'black',
  },
  clearButtonContainer: {
    alignItems: 'flex-end',
    marginRight: 20,
  },
  clearButtonText: {
    color: 'red',
    textDecorationLine: 'underline',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
    paddingLeft: 12,
    color: 'black',
  },
  tinyLogo: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  card: {
    width: Dimensions.get('screen').width - 30,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  titleText: {
    fontSize: 13,
    color: '#000',
    marginTop: 10,
  },
});
