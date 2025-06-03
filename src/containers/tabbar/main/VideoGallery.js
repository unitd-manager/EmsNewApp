import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView,Button,TextInput ,TouchableOpacity } from 'react-native';
import EHeader from '../../../components/common/EHeader';
import EI from 'react-native-vector-icons/EvilIcons';
import WebView from 'react-native-webview';
import api from '../../../api/api';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";


const extractVideoId = (url) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\?v=|embed\/|v\/|watch\?v=))([^&\n?#]+)/);
  return match && match[1];
};

// const videoUrl = 'https://www.youtube.com/watch?v=_5nXq5UvzG8&t=43s';
// const videoId = extractVideoId(videoUrl);
// console.log('Video ID:', videoId);
const VideoGallery = () => {
  const PAGE_SIZE = 5;
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [cateOptions, setcateOption] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  const VidGallery = () => {
    api
      .get('/content/getVideoForApp',{
        params: {
          page: currentPage,
          pageSize: PAGE_SIZE,
        },
      })
      .then((res) => {
        setVideos(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
  };

  const onEndReached = () => {
    const totalItems = videos.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
 

  const fetchGalleryCatecory = () => {
       
    api.get('/content/getVideoCategory')
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
  useEffect(() => {
    VidGallery();
    fetchGalleryCatecory();
    getValuelistCountry();
  }, [])

  const applyFilters = () => {
    let filteredData = [...videos];
    
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

const filteredGallery = applyFilters();
  return (
    <>
      <EHeader title="Video Gallery" />
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
                        <Picker.Item key={item.value} label={item.value} value={item.value}style={styles.pickerItem} />
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
            {/* <Button  title="To" onPress={showDatePickerTo}> </Button> */}
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
      <ScrollView
      onScroll={({ nativeEvent }) => {
        const yOffset = nativeEvent.contentOffset.y;
        const height = nativeEvent.layoutMeasurement.height;
        const contentHeight = nativeEvent.contentSize.height;

        if (yOffset + height >= contentHeight - 20) {
          onEndReached();
        }
      }}
      >
        
        {filteredGallery.slice(0, currentPage * PAGE_SIZE)?.map((item) => {
  console.log('Item Description:', extractVideoId(item.description.replace(/<\/?p>/g, '').trim())); // Add console.log here
  return (
    <View key={item.id} style={styles.singleContainer}>
      <View style={styles.cardTopRow}>
        <View style={styles.halrow}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.head}>{item.title}</Text>
            <Text style={styles.headdesp}>{item.content_type}</Text>
          </View>
        </View>
      </View>
        
      <WebView
        source={{
          html: `
            <iframe 
              src="https://www.youtube.com/embed/${extractVideoId(item.description.replace(/<\/?p>/g, '').trim())}?rel=0" 
              width="100%" 
              height="450" 
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen>
            </iframe>
          `,
        }}
        allowsFullscreenVideo={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
      />
    </View>
  );
})}

</ScrollView>
   <Text style={styles.pageNumberText}>
            Page {currentPage} of {Math.ceil(filteredGallery.length / PAGE_SIZE)}
          </Text>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  videoItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  selectedVideoContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },



  button: {
    backgroundColor: 'green',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 5,
    borderRadius: 3
  },
  buttonText: {
    color: '#fff'
  },
  picker: {
     color:'black',
    borderWidth: 1,
    borderColor: 'gray',
    
  },
  singleContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 10,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    height: 270
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  halrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moredot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
  },
  head: {
    fontSize: 16,
    color: '#163a71',
    fontWeight: '600'
  },
  headdesp: {
    fontSize: 12,
    color: '#222',
  },
  pickerItem: {
    color: 'black', 
    fontSize:14
},
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4C4E66',
    lineHeight: 36,
    marginLeft: 10,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 1,
},
searchInput: {
  height: 40,
  borderColor: 'gray',
  borderWidth: 1,
  margin: 10,
  paddingLeft: 10,
  borderRadius: 8,
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
textColor: {
  color:'white',
  fontSize:13,
 marginLeft:7,
 
  
},
pageNumberText: {
  textAlign:'center',
  fontSize: 16,
  fontWeight: 'bold',
  color: '#532c6d',
},
textContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor:'#52316C',
  padding: 6,
  marginLeft:10,
  marginRight:10,
  borderRadius: 5,

},
textContainer1: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor:'#52316C',
  padding: 6,
  borderRadius: 5,
  marginRight:130
},
filtersContainerDate: {
  flexDirection: 'row',
  justifyContent: 'space-between',
 alignItems: 'center',
  padding: -1,
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
}
});

export default VideoGallery;
