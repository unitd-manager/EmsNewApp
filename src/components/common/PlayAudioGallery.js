import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Slider, TouchableOpacity, View, ScrollView, AppState, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EHeader from './EHeader';
import TrackPlayer, { useProgress, Event } from 'react-native-track-player';
import { moderateScale } from '../../common/constants';
import api from '../../api/api';

const PlayAudio = () => {
  const route = useRoute();
  // console.log('route',route.params.SubId)
  const PAGE_SIZE = 10;
  const [listData, setListData] = useState()
  const [currentPage, setCurrentPage] = useState(1);

  const getMenus = () => {
    api
      .post('/content/getThoguppugalSubContent', {sub_category_id:route.params.SubId,
      params: {
        page: currentPage,
        pageSize: PAGE_SIZE,
      },
    })
      
      .then(res => {
        const serverPath = 'http://43.228.126.245/EMS-API2/storage/uploads/';
        const audioData = res.data.data.map(item => ({
          ...item,
          url: serverPath + item.file_name,
        }));
        setListData(audioData);
      })
      .catch(error => {
        console.log("error", error)
      });

  };
  useEffect(() => {
    getMenus(currentPage);
  }, [currentPage]);

  const onEndReached = () => {
    const totalItems = listData.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };


  const progress = useProgress();

  const [isPlayingArray, setIsPlayingArray] = useState(Array(listData?.length).fill(false));
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [progressArray, setProgressArray] = useState(Array(listData?.length).fill({ position: 0, duration: 0 }));

  const pauseOnUnmount = async () => {
    // Pause and reset the current track when the component is unmounted
    await TrackPlayer.pause();
    setIsPlayingArray(Array(listData?.length).fill(false));
    setCurrentTrackIndex(null);
  }

  useEffect(() => {
    const unsubscribe = TrackPlayer.addEventListener(Event.PlaybackTrackChanged, (event) => {
      console.log("Current Track: ", event.nextTrack)
      if (event.nextTrack) {
        const updatedIsPlayingArray = [...isPlayingArray]
        updatedIsPlayingArray[event.nextTrack] = true
        setIsPlayingArray(updatedIsPlayingArray);
        setCurrentTrackIndex(event.nextTrack)
      }
    })
    const subscription = AppState.addEventListener('blur', () => {
      pauseOnUnmount()
    });
    return () => {
      unsubscribe.remove()
      subscription.remove();
    }
  }, [])

  useEffect(() => {
    const setupPlayerAndAddTracks = async () => {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add(listData);
      const initialState = await TrackPlayer.getState();
    };

    if (listData) {
      setupPlayerAndAddTracks();
    }

    return () => {
      TrackPlayer.pause();
    };
  }, [listData]);

  useEffect(() => {
    return () => pauseOnUnmount()
  }, [])

  const playPause = async (index) => {
    const updatedIsPlayingArray = [...isPlayingArray];
    const isCurrentlyPlaying = currentTrackIndex === index;

    try {
      if (isCurrentlyPlaying && updatedIsPlayingArray[index]) {
        await TrackPlayer.pause();
        updatedIsPlayingArray[index] = false;
      } else {
        if (currentTrackIndex !== null) {
          updatedIsPlayingArray[currentTrackIndex] = false;
          await TrackPlayer.pause();
        }

        await TrackPlayer.skip(index);
        await TrackPlayer.play();

        updatedIsPlayingArray[index] = true;
        setCurrentTrackIndex(index);
        // Check TrackPlayer state after play
        const state = await TrackPlayer.getState();
      }
    } catch (error) {
      console.error('Error playing track:', error);
    }

    setIsPlayingArray(updatedIsPlayingArray);
  };

  useEffect(() => {
    setProgressArray(Array(listData?.length).fill({ position: 0, duration: 0 }));
  }, [listData]);


  return (
    <SafeAreaView style={{ flex: 1 }}>
       <EHeader title="Songs" onPress={() => navigation.pop()} />
      {listData ? (
        <View style={styles.container}>
          <ScrollView style={{ flex: 1 }}
            onScroll={({ nativeEvent }) => {
              const yOffset = nativeEvent.contentOffset.y;
              const height = nativeEvent.layoutMeasurement.height;
              const contentHeight = nativeEvent.contentSize.height;

              if (yOffset + height >= contentHeight - 20) {
                onEndReached();
              }
            }}
            scrollEventThrottle={400}>
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
                    {isPlayingArray[index] ? (
                      <Slider
                        value={progress?.position}
                        maximumValue={progress.duration}
                        minimumValue={0}
                        thumbStyle={{ width: 20, height: 20 }}
                        thumbTintColor={'black'}
                        minimumTrackTintColor={'black'}
                        maximumTrackTintColor={'black'}
                        onValueChange={async (value) => {
                          await TrackPlayer.seekTo(value);
                        }}
                      />
                    ) : (
                      <Slider
                        value={progressArray[index]?.position}
                        minimumValue={0}
                        thumbStyle={{ width: 20, height: 20 }}
                        thumbTintColor={'black'}
                        minimumTrackTintColor={'black'}
                        maximumTrackTintColor={'black'}
                        onValueChange={async (value) => await TrackPlayer.seekTo(value)}
                      />
                    )}
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
    fontWeight: '700'
  },
  pageNumberText: {
    textAlign:'center',
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
    width: '90%'
  },
});