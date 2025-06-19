import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text,TextInput, Dimensions, ScrollView, ActivityIndicator, Button } from 'react-native';
import EHeader from '../../../components/common/EHeader';
import api from '../../../api/api';
import ShowImage from '../../../components/homeComponent/ShowImage';
import DropDownPicker from 'react-native-dropdown-picker';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

// Define the static values for the dropdown


const PhotoGallery = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const openModal = (url) => {
        setSelectedImageUrl(url);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedImageUrl(null);
    };

    const fetchGallery = () => {
        setLoading(true);
        api.get('/content/getPhotoGallery')
            .then((res) => {
                setGallery(res.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log('Error fetching data:', error);
                setLoading(false);
            });
    };

    const fetchGalleryCatecory = () => {
        api.get('/content/getPhotoCategory')
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
    const applyFilters = () => {
        let filteredData = [...gallery];
        
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
        fetchGallery();
        fetchGalleryCatecory();
        getValuelistCountry();
    }, []);

    const filteredGallery = applyFilters();
    console.log('areaFilter',areaFilter)
   

    return (
        <>
            <EHeader title="Photo Gallery" />
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#163a71" />
                </View>
            )}
            <View style={styles.filtersContainer}>
                <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={areaFilter}
                    dropdownIconColor="#52316C"
                    onValueChange={(itemValue) => setAreaFilter(itemValue)}
                    style={styles.picker}
                >
                   <Picker.Item label="Country" value="All" style={styles.pickerItem}/>
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

                {/* <Button title="Go" color={'red'} onPress={applyFilters}></Button> */}
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
            
        
            <ScrollView>
    <View style={styles.galleryContainer}>
        {areaFilter === 'All' && categoryFilter === 'All' ? (
            // Render this content if valuelistCountry is empty
            filteredGallery.map((img, i) => (
                <TouchableOpacity key={i} onPress={() => openModal(img.file_name)}>
                    <Image
                        source={{ uri: `http://43.228.126.245/EMS-API2/storage/uploads/${img.file_name}` }}
                        style={{
                            height: deviceHeight / 7,
                            width: deviceWidth / 3 - 6,
                            borderRadius: 10,
                            margin: 2,
                        }}
                    />
                </TouchableOpacity>
            ))
        ) : (
            // Render this content if valuelistCountry is not empty
            filteredGallery.map((img, i) => (
                <TouchableOpacity key={i} onPress={() => openModal(img.file_name)}>
                    <Image
                        source={{ uri: `http://43.228.126.245/EMS-API2/storage/uploads/${img.file_name}` }}
                        style={{
                            height: deviceHeight / 7,
                            width: deviceWidth / 3 - 6,
                            borderRadius: 10,
                            margin: 2,
                        }}
                    />
                </TouchableOpacity>
            ))
        )}
    </View>
    <ShowImage
        visible={modalVisible}
        imageUrl={selectedImageUrl}
        onClose={closeModal}
    />
</ScrollView>
        </>
    )
}

export default PhotoGallery;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    galleryContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 2
    },
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 1,
    },
    filtersContainerDate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
       alignItems: 'center',
        padding: -1,
    },
    // pickerItem: {
    //     color: 'black', 
    //     fontSize:20
    // },
   
    textColor: {
        color:'white',
        fontSize:13,
       marginLeft:7,
       
        
      },
      textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:'#52316C',
        padding: 6,
        marginLeft:10,
        borderRadius: 5,
        marginRight:10
      
      },
      textContainer1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:'#52316C',
        borderRadius: 5,
        padding: 6,
        marginRight:130
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
