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
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import api from '../../../api/api';
// import AboutCategoryDetail from './AboutCategoryDetail';
import AboutCategoryArticles from './AboutCategoryArticles';
import EHeader from '../../../components/common/EHeader';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const ListFlat = () => {
  const route = useRoute();

  

  const [loading, setLoading] = React.useState(false);
  const [detailview, setDetailView] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState();
  const [clients, setClients] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
    const [areaFilter, setAreaFilter] = useState('All');
    const [cateOptions, setcateOption] = useState([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisibleTo, setDatePickerVisibilityTo] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [valuelistCountry, setValuelistCountry] = useState([]);

    

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const showDatePickerTo = () => {
        setDatePickerVisibilityTo(true);
    };

    const hideDatePickerTo = () => {
        setDatePickerVisibilityTo(false);
    };

    const handleConfirm = (date) => {
      
            setFromDate(date);
       
        hideDatePicker();
    };
    const handleConfirmTo = (date) => {

       
            setToDate(date);
        
            hideDatePickerTo();
    };
    useEffect(() => {
      setLoading(true);
      api
      .post('/content/getArticleByMagazineId', { magazine_id: route.params.magazineId })
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

  const handleItemPress = (id) => {
    
    api
      .post('/content/getArticleByArticeId', { article_id: id })
      .then((res) => {
        setSelectedItem(res.data.data);
      })
      .catch((error) => {
        console.log('Error fetching Event details by ID:', error);
      });
  };

  const onDismiss = async () => {
    setDetailView(false);
  }

  
  
  const fetchGalleryCatecory = () => {
    api.get('/content/getEventCategory')
        .then((res) => {
            setcateOption(res.data.data);
        })
        .catch((error) => {
            console.log('Error fetching data:', error);
        });
};

const getValuelistCountry = () => {
  api
    .get('/valuelist/getValueListCountry')
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
  if (categoryFilter !== 'All') {
      filteredData = filteredData.filter(item => item.author === categoryFilter);
  }

 // Apply search filter
 if (searchQuery !== '') {
  filteredData = filteredData.filter(item =>
      (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
      <EHeader title='Articles' />
      {/* <EHeader title={route.params.section_title} /> */}
      <View style={styles.filtersContainer}>
               
                {/* <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={categoryFilter}
                    onValueChange={(itemValue) => setAreaFilter(itemValue)}
                    style={styles.picker}
                >
                   <Picker.Item label="Author" value="" style={styles.pickerItem}/>
                    {filteredGallery.map((item) => (
                        <Picker.Item key={item.author} label={item.author} value={item.author} />
                    ))}
                </Picker>
                </View> */}
            </View>
{/*             
            {categoryFilter !== null && (
                    <TouchableOpacity onPress={() => {setCategoryFilter(null)}} style={styles.clearButtonContainer}>
                        <Text style={styles.clearButtonText}>Clear</Text>
                    </TouchableOpacity>
                )} */}
        <TextInput 
            color="black"
            style={styles.searchInput}
            placeholder=" Search Author name and Title ..."
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
                      handleItemPress(item.article_id)
                      setDetailView(true);
                    }}>
                    
                    <Image
                      style={styles.tinyLogo}
                      source={{
                        uri: `http://43.228.126.245/EMS-API2/storage/uploads/${item.file_name}`,
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
        <AboutCategoryArticles detailview={detailview} setDetailView={setDetailView} singleDetail={selectedItem} onDismiss={onDismiss}></AboutCategoryArticles>
        {/* // <AboutCategoryDetail detailview={detailview} setDetailView={setDetailView} singleDetail={selectedItem} onDismiss={onDismiss}></AboutCategoryDetail> */}
      </View>
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
pickerItem: {
  color: 'black', 
  fontSize:20
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
    paddingLeft: 10,
},
textColor: {
    color:'white'
},
pickerContainer: {
  borderColor: 'gray',
  borderWidth: 1,
  borderRadius: 3,
  marginVertical: 10,
  marginLeft:10,
  width: 190,
  height:40,
  justifyContent: 'center',
},
picker: {

  borderWidth: 1,
  borderColor: 'gray',
  
},
pickerItem: {
  color: 'black', 
  fontSize:15
},
  tinyLogo: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    borderRadius: 10,
    alignSelf: 'center',
  },
});
