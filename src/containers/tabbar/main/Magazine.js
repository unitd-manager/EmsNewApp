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
  ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import api from '../../../api/api';
import { StackNav } from '../../../navigation/NavigationKeys';
import { useNavigation } from '@react-navigation/native';
import AboutCategoryDetail from './AboutCategoryDetail';
import EHeader from '../../../components/common/EHeader';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const ListFlat = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [detailview, setDetailView] = React.useState(false);
  const [userContactId, setUserContactId] = useState([]);
  const [selectedItem, setSelectedItem] = React.useState();
  const [categoryFilter, setCategoryFilter] = useState(null);
    const [areaFilter, setAreaFilter] = useState(null);
    const [cateOptions, setcateOption] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [valuelistCountry, setValuelistCountry] = useState([]);

console.log('userContactId',userContactId)
    useEffect(() => {
      const getUserCart = async () => {
        try {
          const userData = await AsyncStorage.getItem('USER');
          const user = JSON.parse(userData);
          console.log('conta',user?.contact_id || null)
          
          setUserContactId(user?.contact_id || null);
          
          api
            .post('/contact/getContactsById', {
              contact_id: user?.contact_id || null,
            })
            .then(res => {
              const contactCri = res.data.data;
             console.log('contactCri',contactCri)
             console.log('contact_id',contactCri[0].contact_id)
             console.log('subs_payment_status',contactCri[0].subs_payment_status)
             setUserContactId(contactCri[0].contact_id)
              if (contactCri[0].subs_payment_status !== 'subscribe') {
                Alert.alert('Magazine payment is not done!');
                navigation.navigate(StackNav.Payment);
                return;
              }
  
          
             
            });
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      };
  
      getUserCart();
    }, []);
  

    const handleItemPress = (id) => {
    
    api
      .post('/content/getArticleByMagazineId', { magazine_id: id })
      .then((res) => {
        setSelectedItem(res.data.data);
        navigation.navigate(StackNav.Articles, { magazineId: id }); 
      })
      .catch((error) => {
        console.log('Error fetching Event details by ID:', error);
      });
  };

  const onDismiss = async () => {
    setDetailView(false);
  }
  
  const fetchGalleryCatecory = () => {
    api.get('/content/getMagazineYear')
        .then((res) => {
            setcateOption(res.data.data);
        })
        .catch((error) => {
            console.log('Error fetching data:', error);
        });
};
  useEffect(() => {
    setLoading(true);
    api
      .get('/content/getMagazine')
      .then((res) => {
        res.data.data.forEach((element) => {
          element.tag = String(element.tag).split(',');
        });
        setClients(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching client details by ID:', error);
      });

  }, []);

const getValuelistCountry = () => {
  api
    .get('/content/getMagazineMonth')
    .then((res) => {
      setValuelistCountry(res.data.data);
    })
    .catch((error) => {
      console.log('valuelist not found:', error);
    });
};


const applyFilters = () => {
  let filteredData = [...clients];
 
  // Apply category filter
  if (categoryFilter !== null) {
      filteredData = filteredData.filter(item => item.year === categoryFilter);
  }

  // Apply area filter
  if (areaFilter !== null) {
      filteredData = filteredData.filter(item => item.month === areaFilter);
  }

 
 if (searchQuery !== '') {
  filteredData = filteredData.filter(item =>
      (item.search_keyword && item.search_keyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );
}


  return filteredData;
};

useEffect(() => {
  getValuelistCountry();
  fetchGalleryCatecory();
}, []);

     const filteredGallery = applyFilters();
     
  return (

    <>
    
      <EHeader title={route.params.item.section_title} />
      {userContactId ? (
        <>
      <View style={styles.filtersContainer}>
                <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={categoryFilter}
                    dropdownIconColor="#52316C"
                    onValueChange={(itemValue) => setCategoryFilter(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Year" value="" style={styles.pickerItem}/>
                    {cateOptions.map((item) => (
                        <Picker.Item key={item.year} label={item.year} value={item.year} style={styles.pickerItem} />
                    ))}
                </Picker>
                </View>
                <View style={styles.pickerContainer1}>
                <Picker
                    selectedValue={areaFilter}
                    dropdownIconColor="#52316C"
                    onValueChange={(itemValue) => setAreaFilter(itemValue)}
                    style={styles.picker}
                >
                   <Picker.Item label="Select Month" value="" style={styles.pickerItem}/>
                    {valuelistCountry.map((item) => (
                        <Picker.Item key={item.name} label={item.month} value={item.name} style={styles.pickerItem} />
                    ))}
                </Picker>
                </View>
               
            </View>
            {categoryFilter !== null || areaFilter !== null  ? (
    <TouchableOpacity onPress={() => { setCategoryFilter(null), setAreaFilter(null)}} style={styles.clearButtonContainer}>
        <Text style={styles.clearButtonText}>Clear</Text>
    </TouchableOpacity>
        ) : null}
       
        <TextInput
            style={styles.searchInput}
            color='black'
            placeholder=" Search..."
            placeholderTextColor="black"
            onChangeText={(text) => setSearchQuery(text)}
            value={searchQuery}
         />
        <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {loading ? (
              <ActivityIndicator></ActivityIndicator>
            ) : (
              <FlatList
                data={filteredGallery}
                horizontal={false}
                numColumns={1}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <Pressable
                    style={{
                      width: Dimensions.get('screen').width - 30, // Adjusted width to match screen width
                      margin: 5,
                      backgroundColor: '#fff',
                      borderRadius: 5,
                      padding: 15,
                      marginBottom: 10
                    }}
                    onPress={() => {
                      handleItemPress(item.magazine_id)
                      // setDetailView(true);
                    }}>
                    
                    <Image
                      style={styles.tinyLogo}
                      source={{
                        uri: `http://43.228.126.245/EMS-API/storage/uploads/${item.file_name}`,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#000',
                          marginTop: 10,
                        }}>
                        {item.title}
                      </Text>
                    </View>
                  </Pressable>
                )}
                keyExtractor={item => item.id}
              />
            )}
          </View>
        </ScrollView>
        <AboutCategoryDetail detailview={detailview} setDetailView={setDetailView} singleDetail={selectedItem} onDismiss={onDismiss}></AboutCategoryDetail>
      </View>
</>
):(navigation.navigate(StackNav.HomeTab),
Alert.alert('Magazine payment is not done!')
  )}
    </>

  );
};

export default ListFlat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    marginLeft:-5
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
  marginLeft:10,
  width: 180,
  height:40,
  justifyContent: 'center',
},
pickerContainer1: {
  borderColor: 'gray',
  borderWidth: 1,
  borderRadius: 8,
  marginVertical: 10,
  marginRight:10,
  width: 180,
  height:40,
  justifyContent: 'center',
},
picker: {
  color:'black',
  borderWidth: 1,
  borderColor: 'gray',
  
},
pickerItem: {
  color: 'black', 
  fontSize:14
},
filtersContainerDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
   alignItems: 'center',
    padding: -1,
},
textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#52316C',
    padding: 7,
    marginLeft:5,
    marginBottom:7
 
},
textContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#52316C',
    padding: 7,
    marginRight:130,
    marginBottom:7
},
clearButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginLeft:315
},
clearButtonText: {
    color: 'red',
    textDecorationLine: 'underline',
},
searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius:8,
    margin: 10,
    paddingLeft: 12,
},
textColor: {
    color:'white'
},
  tinyLogo: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    borderRadius: 10,
    alignSelf: 'center',
  },
});
