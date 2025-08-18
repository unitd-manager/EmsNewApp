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
import imageBase from '../../../api/imageBase';
import { useRoute } from '@react-navigation/native';
import api from '../../../api/api';
import AboutCategoryDetail from './AboutCategoryDetail';
import EHeader from '../../../components/common/EHeader';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const ListFlat = () => {
  const route = useRoute();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [detailview, setDetailView] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState();
  const [categoryFilter, setCategoryFilter] = useState('All');
    const [areaFilter, setAreaFilter] = useState('All');
    const [cateOptions, setcateOption] = useState([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisibleTo, setDatePickerVisibilityTo] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [valuelistCountry, setValuelistCountry] = useState([]);
    const [valuelistCity, setValuelistCity] = useState([]);

    console.log('fromDate',fromDate)
    console.log('toDate',toDate)

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

  const handleItemPress = (id) => {
    console.log('id',id)
    api
      .post('/content/getEventImageById', { content_id: id })
      .then((res) => {
        setSelectedItem(res.data.data);
      })
      .catch((error) => {
        console.log('Error fetching Event details by ID:', error);
      });
  };
  useEffect(() => {
    const countryValue = areaFilter
    console.log('countryValue',countryValue)
            api
            .post('/valuelist/getValueListCity',{value:countryValue})
            .then((res1) => {
              setValuelistCity(res1.data.data);
              console.log('country',res1.data.data)
             })
  }, [areaFilter]);
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
  useEffect(() => {
    setLoading(true);
    api
      .get('/content/getEventPhotoGallery')
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
console.log('selectedItem',selectedItem)
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
  // console.log('filteredData',filteredData)
  // Apply category filter
  if (categoryFilter !== 'All') {
      filteredData = filteredData.filter(item => item.upload_city === categoryFilter);
  }

  // Apply area filter
  if (areaFilter !== 'All') {
      filteredData = filteredData.filter(item => item.upload_country === areaFilter);
  }

  // Apply date filter if selected
  if (fromDate && toDate) {
      filteredData = filteredData.filter(item => {
          const contentDate = new Date(item.content_date);
          return contentDate >= fromDate && contentDate <= toDate;
      });
  }

 // Apply search filter
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
      <EHeader title='Event'/>
      <View style={styles.filtersContainer}>
                               
                <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={areaFilter}
                    dropdownIconColor="#52316C"
                    onValueChange={(itemValue) => setAreaFilter(itemValue)}
                    style={styles.picker}
                >
                   <Picker.Item label="Country" value="" style={styles.pickerItem}/>
                    {valuelistCountry.map((item) => (
                        <Picker.Item key={item.value} label={item.value} value={item.value} style={styles.pickerItem}/>
                    ))}
                </Picker>
                </View>
                <View style={styles.pickerContainer1}>
                <Picker
                    selectedValue={categoryFilter}
                    dropdownIconColor="#52316C"
                    onValueChange={(itemValue) => setCategoryFilter(itemValue)}
                    style={styles.picker}
                >
                   <Picker.Item label="City" value="" style={styles.pickerItem}/>
                    {valuelistCity.map((item) => (
                        <Picker.Item key={item.citi_value} label={item.citi_value} value={item.citi_value} style={styles.pickerItem} />
                    ))}
                </Picker>
                </View>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}

                    onCancel={hideDatePicker}
                />
                

                <DateTimePickerModal
                isVisible={isDatePickerVisibleTo}
                mode="date"
                onConfirm={handleConfirmTo}
                onCancel={hideDatePickerTo}
                />

              
            </View>
            
            <View style={styles.filtersContainerDate}>
          
            <TouchableOpacity onPress={showDatePicker} style={[styles.textContainer, { width: '32%' }]}>
                <Text style={styles.textColor}>{fromDate ? fromDate.toDateString() : 'From date'}</Text>
            </TouchableOpacity>
           
            <TouchableOpacity onPress={showDatePickerTo} style={[styles.textContainer1, { width: '32%' }]}>
                <Text style={styles.textColor}>{toDate ? toDate.toDateString() : 'To date'}</Text>
            </TouchableOpacity>
            </View>
           {toDate !== null || areaFilter !== 'All' ? (
    <TouchableOpacity onPress={() => {setFromDate(null), setToDate(null), setAreaFilter('All'),setCategoryFilter('All')}} style={styles.clearButtonContainer}>
        <Text style={styles.clearButtonText}>Clear</Text>
    </TouchableOpacity>
) : null}
        <TextInput
            style={styles.searchInput}
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
                numColumns={2}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  console.log('item',item.content_id),
                  <Pressable
                    style={{
                      width: (Dimensions.get('screen').width - 50) / 2,
                      margin: 5,
                      backgroundColor: '#fff',
                      borderRadius: 5,
                      padding: 15,
                      marginBottom: 10
                    }}
                    onPress={() => {
                      handleItemPress(item.content_id)
                      setDetailView(true);
                    }}>
                    
                    <Image
                      style={styles.tinyLogo}
                      source={{
                        uri: `${imageBase}${item.file_name}`,
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

  );
};

export default ListFlat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
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
    marginLeft:10,
    borderRadius: 5,
    marginBottom:7
 
},
textContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#52316C',
    padding: 7,
    borderRadius: 5,
    marginRight:120,
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
    margin: 10,
    borderRadius: 8,
    paddingLeft: 10,
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
   
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 3,
    marginVertical: 10,
    marginLeft:10,
    width: 180,
    borderRadius: 8,
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

    borderWidth: 1,
    borderColor: 'gray',
    color:'black',   
    fontSize:14
    
  },
  pickerItem: {
    color: 'black', 
    fontSize:13
},
});
