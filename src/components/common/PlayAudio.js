import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Button, TextInput,TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';
import api from '../../api/api';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Slider from 'react-native-slider';

const PlayAudio = () => {
  const PAGE_SIZE = 8;
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [isPlayingArray, setIsPlayingArray] = useState(Array(PAGE_SIZE).fill(false));
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [progressArray, setProgressArray] = useState(Array(PAGE_SIZE).fill({ position: 0, duration: 0 }));
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Additional state for fetching data and filters (omitted for brevity)
  
  const getMenus = () => {
    api
      .get('/content/getAudioGallery', { params: { page: currentPage, pageSize: PAGE_SIZE } })
      .then(res => {
        const serverPath = 'http://43.228.126.245/EMS-API/storage/uploads/';
        const audioData = res.data.data.map(item => ({ ...item, url: serverPath + item.file_name }));
        setListData(audioData);
      })
      .catch(error => console.log("error", error));
  };

  useEffect(() => {
    getMenus();
  }, [currentPage]);

  const playPause = (index) => {
    const updatedIsPlayingArray = [...isPlayingArray];
    const isCurrentlyPlaying = currentTrackIndex === index;

    if (isCurrentlyPlaying && updatedIsPlayingArray[index]) {
      updatedIsPlayingArray[index] = false;
      setCurrentTrackIndex(null);
    } else {
      updatedIsPlayingArray.fill(false);
      updatedIsPlayingArray[index] = true;
      setCurrentTrackIndex(index);
    }
    setIsPlayingArray(updatedIsPlayingArray);
  };

  const handleProgress = (index) => (data) => {
    const updatedProgressArray = [...progressArray];
    updatedProgressArray[index] = { position: data.currentTime, duration: data.seekableDuration };
    setProgressArray(updatedProgressArray);
  };

  const filteredGallery = listData.filter(item => {
    // Apply filters based on searchQuery and others (omitted for brevity)
    return true; // Return filtered data based on your criteria
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Filters and Inputs (omitted for brevity) */}
      {filteredGallery.length ? (
        <ScrollView style={styles.container}>
          {filteredGallery.map((item, index) => (
            <View style={styles.singleContainer} key={index}>
              <Text style={styles.titleText}>{item.title}</Text>
              <TouchableOpacity onPress={() => playPause(index)}>
                <AntDesign name={isPlayingArray[index] ? 'pausecircle' : 'play'} size={25} color={'#000'} />
              </TouchableOpacity>
              <Video
                source={{ uri: item.url }}
                style={{ height: 0, width: 0 }} // Hidden video element
                onProgress={handleProgress(index)}
                paused={!isPlayingArray[index]}
                onEnd={() => {
                  const updatedIsPlayingArray = [...isPlayingArray];
                  updatedIsPlayingArray[index] = false;
                  setCurrentTrackIndex(null);
                  setIsPlayingArray(updatedIsPlayingArray);
                }}
              />
              <Slider
                value={progressArray[index]?.position}
                maximumValue={progressArray[index]?.duration || 0}
                minimumValue={0}
                thumbStyle={{ width: 20, height: 20 }}
                thumbTintColor={'black'}
                minimumTrackTintColor={'black'}
                maximumTrackTintColor={'black'}
                onValueChange={(value) => {
                  // Seek to the new position (you can also implement seeking functionality)
                  // setSeekPosition(value);
                }}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <ActivityIndicator size="large" color="#000" />
      )}
    </SafeAreaView>
  );
};

export default PlayAudio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  titleText: {
    color: '#117a4c',
    fontWeight: '700',
  },
  singleContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 10,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
});
