import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, AppState } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Sound from 'react-native-sound';
import { moderateScale } from '../../../common/constants';
import { listData } from '../../../api/constant';
import EHeader from '../../../components/common/EHeader';
import Slider from '@react-native-community/slider';

const AudioGallery = () => {
  const route = useRoute();
  const [isPlayingArray, setIsPlayingArray] = useState(Array(listData.length).fill(false));
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [progressArray, setProgressArray] = useState(Array(listData.length).fill({ position: 0, duration: 0 }));
  const soundRef = useRef(null);
  const progressInterval = useRef(null);

  const pauseOnUnmount = () => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current.release();
        soundRef.current = null;
      });
    }
    setIsPlayingArray(Array(listData.length).fill(false));
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
      setProgress(index, value, progressArray[index].duration);
    }
  };

  return (
    <>
      <EHeader title={route.params.item.section_title} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <ScrollView>
            {listData.map((item, index) => (
              <View style={styles.singleContainer} key={index}>
                <View style={styles.cardTopRow}>
                  <View style={styles.halrow}>
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={styles.titleText}>{item.title}</Text>
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
                      value={progressArray[index].position}
                      maximumValue={progressArray[index].duration}
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
        </View>
      </SafeAreaView>
    </>
  );
};

export default AudioGallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  titleText: {
    color: '#000',
  },
  singleContainer: {
    backgroundColor: '#fff',
    marginBottom: 15,
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
