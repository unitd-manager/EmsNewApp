import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, AppState, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Sound from 'react-native-sound';
import EHeader from './EHeader';
import { moderateScale } from '../../common/constants';
import api from '../../api/api';
import Slider from '@react-native-community/slider';
import imageBase from '../../api/imageBase';

const PlayAudio = () => {
  const route = useRoute();
  const PAGE_SIZE = 10;
  const [listData, setListData] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const [isPlayingArray, setIsPlayingArray] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [progressArray, setProgressArray] = useState([]);
  const soundRef = useRef(null);
  const progressInterval = useRef(null);

  const getMenus = () => {
    api
      .post('/content/getThoguppugalSubContent', {
        sub_category_id: route.params.SubId,
        params: {
          page: currentPage,
          pageSize: PAGE_SIZE,
        },
      })
      .then((res) => {
const serverPath = imageBase;
        const audioData = res.data.data.map((item) => ({
          ...item,
          url: serverPath + item.file_name,
        }));
        setListData(audioData);
        setIsPlayingArray(Array(audioData.length).fill(false));
        setProgressArray(Array(audioData.length).fill({ position: 0, duration: 0 }));
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  useEffect(() => {
    getMenus(currentPage);
  }, [currentPage]);

  const onEndReached = () => {
    if (!listData) return;
    const totalItems = listData.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const pauseOnUnmount = () => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current.release();
        soundRef.current = null;
      });
    }
    setIsPlayingArray(Array(listData?.length).fill(false));
    setCurrentTrackIndex(null);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('blur', () => {
      pauseOnUnmount();
    });
    return () => {
      subscription.remove();
      pauseOnUnmount();
    };
  }, []);

  const playPause = (index) => {
    if (currentTrackIndex === index && isPlayingArray[index]) {
      // Pause current playing track
      if (soundRef.current) {
        soundRef.current.pause();
      }
      updateIsPlayingArray(index, false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else {
      // Stop previous track
      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current.release();
          soundRef.current = null;
        });
      }
      // Play new track
      const track = listData[index];
      const soundInstance = new Sound(track.url || track.file || '', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        soundRef.current = soundInstance;
        soundInstance.play((success) => {
          if (success) {
            // Auto play next track
            if (index < listData.length - 1) {
              playPause(index + 1);
            } else {
              updateIsPlayingArray(index, false);
              setCurrentTrackIndex(null);
              if (progressInterval.current) {
                clearInterval(progressInterval.current);
              }
            }
          } else {
            console.log('Playback failed due to audio decoding errors');
          }
        });
        updateIsPlayingArray(index, true);
        setCurrentTrackIndex(index);
        setProgress(index, 0, soundInstance.getDuration());
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
        progressInterval.current = setInterval(() => {
          soundInstance.getCurrentTime((seconds) => {
            setProgress(index, seconds, soundInstance.getDuration());
          });
        }, 1000);
      });
    }
  };

  const updateIsPlayingArray = (index, playing) => {
    const updated = [...isPlayingArray];
    updated.fill(false);
    if (playing) {
      updated[index] = true;
    }
    setIsPlayingArray(updated);
  };

  const setProgress = (index, position, duration) => {
    const updated = [...progressArray];
    updated[index] = { position, duration };
    setProgressArray(updated);
  };

  const seekTo = (index, value) => {
    if (soundRef.current && currentTrackIndex === index) {
      soundRef.current.setCurrentTime(value);
      setProgress(index, value, progressArray[index]?.duration);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <EHeader title="Songs" />
      {listData ? (
        <View style={styles.container}>
          <ScrollView
            style={{ flex: 1 }}
            onScroll={({ nativeEvent }) => {
              const yOffset = nativeEvent.contentOffset.y;
              const height = nativeEvent.layoutMeasurement.height;
              const contentHeight = nativeEvent.contentSize.height;

              if (yOffset + height >= contentHeight - 20) {
                onEndReached();
              }
            }}
            scrollEventThrottle={400}
          >
            {listData.slice(0, currentPage * PAGE_SIZE)?.map((item, index) => (
              <View style={styles.singleContainer} key={index}>
                <View style={styles.cardTopRow}>
                  <View style={styles.halrow}>
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={styles.titleText}>{item?.title}</Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity onPress={() => playPause(index)}>
                    <AntDesign
                      name={isPlayingArray[index] ? 'pausecircle' : 'play'}
                      size={moderateScale(25)}
                      color={'#000'}
                    />
                  </TouchableOpacity>

                  <View style={styles.sliderView}>
                    <Slider
                      value={progressArray[index]?.position}
                      maximumValue={progressArray[index]?.duration}
                      minimumValue={0}
                     thumbStyle={{ width: 20, height: 20 }}
                      thumbTintColor={'black'}
                      minimumTrackTintColor={'black'}
                      maximumTrackTintColor={'black'}
                      onValueChange={(value) => seekTo(index, value)}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          <Text style={styles.pageNumberText}>
            Page {currentPage} of {Math.ceil(listData.length / PAGE_SIZE)}
          </Text>
        </View>
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
  pageNumberText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#532c6d',
  },
  textStyle: {
    flex: 1,
    padding: 5,
  },
  buttonPlay: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(00,80,00,1)',
    borderWidth: 1,
    borderColor: 'rgba(80,80,80,0.5)',
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  buttonStop: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(80,00,00,1)',
    borderWidth: 1,
    borderColor: 'rgba(80,80,80,0.5)',
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  feature: {
    flexDirection: 'row',
    padding: 5,
    marginTop: 7,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgb(180,180,180)',
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
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  halrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderView: {
    alignSelf: 'center',
    width: '90%',
  },
});
