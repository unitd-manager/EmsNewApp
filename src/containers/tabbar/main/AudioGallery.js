// import React, { useEffect, useState } from 'react';
// import { SafeAreaView, StyleSheet, Text, Slider, TouchableOpacity, View, ScrollView, AppState } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import TrackPlayer, { useProgress, Event } from 'react-native-track-player';
// import { moderateScale } from '../../../common/constants';
// //import { listData } from '../../../api/constant';
// import EHeader from '../../../components/common/EHeader';
// import api from '../../../api/api';

// const AudioGallery = () => {
//   const route = useRoute();
//   const [selectedItem, setSelectedItem] = React.useState();
//   const [isPlayingArray, setIsPlayingArray] = useState(Array(selectedItem.length).fill(false));
//   const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
//   const [progressArray, setProgressArray] = useState(Array(selectedItem.length).fill({ position: 0, duration: 0 }));

//   const progress = useProgress();

//   const pauseOnUnmount = async () => {
//     // Pause and reset the current track when the component is unmounted
//     await TrackPlayer.pause();
//     setIsPlayingArray(Array(selectedItem.length).fill(false));
//     setCurrentTrackIndex(null);
//   }

//   useEffect(() => {
//     const unsubscribe = TrackPlayer.addEventListener(Event.PlaybackTrackChanged, (event) => {
//       if (event.nextTrack) {
//         const updatedIsPlayingArray = [...isPlayingArray]
//         updatedIsPlayingArray[event.nextTrack] = true
//         setIsPlayingArray(updatedIsPlayingArray);
//         setCurrentTrackIndex(event.nextTrack)
//       }
//     })
//     const subscription = AppState.addEventListener('blur', () => {
//       pauseOnUnmount()
//     });
//     return () => {
//       unsubscribe.remove()
//       subscription.remove();
//     }
//   }, [])

//   useEffect(() => {
//     const setupPlayerAndAddTracks = async () => {
//       await TrackPlayer.setupPlayer();
//       await TrackPlayer.add(selectedItem);
//     };
//     setupPlayerAndAddTracks();

//     return () => {
//       TrackPlayer.pause();
//     };
//   }, [])

//   useEffect(() => {
//     return () => pauseOnUnmount()
//   }, [])
//   useEffect(()=>{
//     api
//     .get('/content/getAudioGallery')
//     .then((res) => {
//       setSelectedItem(res.data.data);
//       console.log('audios:', res.data.data);
//     })
//     .catch((error) => {
//       console.log('Error fetching client details by ID:', error);
//     });
// },[])

//   const playPause = async (index) => {
//     const updatedIsPlayingArray = [...isPlayingArray];
//     const isCurrentlyPlaying = currentTrackIndex === index;

//     if (isCurrentlyPlaying && updatedIsPlayingArray[index]) {
//       await TrackPlayer.pause();
//       updatedIsPlayingArray[index] = false;
//     } else {
//       if (currentTrackIndex !== null) {
//         updatedIsPlayingArray[currentTrackIndex] = false;
//         await TrackPlayer.pause();
//       }

//       await TrackPlayer.skip(index);
//       await TrackPlayer.play();

//       updatedIsPlayingArray[index] = true;
//       setCurrentTrackIndex(index);
//     }

//     setIsPlayingArray(updatedIsPlayingArray);
//   };

//   return (
//     <>
//       <EHeader title={route.params.item.section_title} />
//       <SafeAreaView style={{ flex: 1 }}>
//         <View style={styles.container}>
//           <ScrollView>
//             {selectedItem.map((item, index) => (
//               <View style={styles.singleContainer} key={index}>
//                 <View style={styles.cardTopRow}>
//                   <View style={styles.halrow}>
//                     <View style={{ flexDirection: 'column' }}>
//                       <Text style={styles.titleText}>{item.title}</Text>
//                     </View>
//                   </View>
//                 </View>

//                 <View
//                   style={{
//                     display: 'flex',
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                   }}
//                 >
//                   <TouchableOpacity onPress={() => playPause(index)}>
//                     <AntDesign
//                       name={isPlayingArray[index] ? 'pausecircle' : 'play'}
//                       size={moderateScale(25)}
//                       color={'#000'}
//                     />
//                   </TouchableOpacity>

//                   <View style={styles.sliderView}>
//                     {isPlayingArray[index] ? (
//                       <Slider
//                         value={progress.position}
//                         maximumValue={progress.duration}
//                         minimumValue={0}
//                         thumbStyle={{ width: 20, height: 20 }}
//                         thumbTintColor={'black'}
//                         minimumTrackTintColor={'black'}
//                         maximumTrackTintColor={'black'}
//                         onValueChange={async (value) => {
//                           await TrackPlayer.seekTo(value);
//                         }}
//                       />
//                     ) : (
//                       <Slider
//                         value={progressArray[index].position}
//                         minimumValue={0}
//                         thumbStyle={{ width: 20, height: 20 }}
//                         thumbTintColor={'black'}
//                         minimumTrackTintColor={'black'}
//                         maximumTrackTintColor={'black'}
//                         onValueChange={async (value) => await TrackPlayer.seekTo(value)}
//                       />
//                     )}
//                   </View>
//                 </View>
//               </View>
//             ))}
//           </ScrollView>
//         </View>
//       </SafeAreaView>
//     </>
//   );
// };

// export default AudioGallery;


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     padding: 10,
//   },
//   titleText: {
//     color: '#000'
//   },
//   singleContainer: {
//     backgroundColor: '#fff',
//     marginBottom: 15,
//     borderRadius: 10,
//     shadowOpacity: 0.4,
//     shadowRadius: 10,
//     elevation: 5,
//     paddingHorizontal: 20,
//     paddingBottom: 15,
//   },
//   cardTopRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 15,
//   },
//   halrow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   sliderView: {
//     alignSelf: 'center',
//     width: '90%'
//   },
// });


import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, AppState } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TrackPlayer, { useProgress, Event } from 'react-native-track-player';
import { moderateScale } from '../../../common/constants';
import { listData } from '../../../api/constant';
import EHeader from '../../../components/common/EHeader';
import Slider from '@react-native-community/slider';

const AudioGallery = () => {
  const route = useRoute();
  const [isPlayingArray, setIsPlayingArray] = useState(Array(listData.length).fill(false));
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [progressArray, setProgressArray] = useState(Array(listData.length).fill({ position: 0, duration: 0 }));

  const progress = useProgress();

  const pauseOnUnmount = async () => {
    // Pause and reset the current track when the component is unmounted
    await TrackPlayer.pause();
    setIsPlayingArray(Array(listData.length).fill(false));
    setCurrentTrackIndex(null);
  }
console.log('listdata',listData);
  useEffect(() => {
    const unsubscribe = TrackPlayer.addEventListener(Event.PlaybackTrackChanged, (event) => {
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
    };
    setupPlayerAndAddTracks();
    console.log('listdata',listData);
    return () => {
      TrackPlayer.pause();
    };
  }, [])

  useEffect(() => {
    return () => pauseOnUnmount()
  }, [])

  const playPause = async (index) => {
    const updatedIsPlayingArray = [...isPlayingArray];
    const isCurrentlyPlaying = currentTrackIndex === index;

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
    }

    setIsPlayingArray(updatedIsPlayingArray);
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
                    {isPlayingArray[index] ? (
                      <Slider
                        value={progress.position}
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
                        value={progressArray[index].position}
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
    color: '#000'
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
    width: '90%'
  },
});
