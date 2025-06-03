import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Slider,
    FlatList,
} from 'react-native';
import TrackPlayer, { Capability, usePlaybackState, useProgress, State } from 'react-native-track-player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { moderateScale } from '../../common/constants';
import { listData } from '../../api/constant';

const MusicListItems = ({ item, index }) => {

    console.log("index",index )

    const [currentAudio, setCurrentAudio] = useState(index);

    const progress = useProgress();
    const playbackState = usePlaybackState()
    const ref = useRef()


    useEffect(() => {
        setupPlayer();
    }, []);

    const setupPlayer = async () => {
        try {
            await TrackPlayer.setupPlayer();
            await TrackPlayer.updateOptions({
                capabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious,
                    Capability.Stop,
                ],
                compactCapabilities: [Capability.Play, Capability.Pause],
            });
            await TrackPlayer.add(listData);
            await TrackPlayer.skip(currentAudio);
            togglePlayback(playbackState);
        } catch (error) {
            console.error('Error setting up player', error);
        }
    };

    const togglePlayback = async playbackState => {
        console.log(playbackState)
        if (playbackState === State.Paused || playbackState === State.Ready || playbackState === State.Buffering || playbackState === State.Connecting) {
            await TrackPlayer.play();
        } else {
            await TrackPlayer.pause();
        }
    }

    return (
        <View style={styles.singleContainer}>

            <View style={styles.cardTopRow}>
                <View style={styles.halrow}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.head}>{item.title}</Text>
                    </View>
                </View>
            </View>

            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                
                <TouchableOpacity
                    onPress={async () => {
                        togglePlayback(playbackState);
                    }}>
                    {playbackState == State.Paused || playbackState == State.Ready ? <AntDesign
                        name="play"
                        size={moderateScale(25)}
                        color={'#000'}
                    /> : <AntDesign
                        name="pausecircle"
                        size={moderateScale(25)}
                        color={'#000'}
                    />}

                </TouchableOpacity>

                <View style={styles.sliderView}>
                    <Slider
                        value={progress.position}
                        maximumValue={progress.duration}
                        minimumValue={0}
                        thumbStyle={{ width: 20, height: 20 }}
                        thumbTintColor={'black'}
                        onValueChange={async value => {
                            await TrackPlayer.seekTo(value);
                        }}
                    />
                </View>

            </View>
        </View>
    );
};

export default MusicListItems;

const styles = StyleSheet.create({
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
        color: '#095225',
        fontWeight: '600'
    },
    headdesp: {
        fontSize: 12,
        color: '#222',
    },

    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4C4E66',
        lineHeight: 36,
        marginLeft: 10,
    },
    sliderView: {
        alignSelf: 'center',
        width: '90%'
    },
});

// import React, { useRef } from 'react';
// import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import EI from 'react-native-vector-icons/EvilIcons';

// const MusicListItems = ({ item, index }) => {
//   const navigation = useNavigation();
//   const playingIndexRef = useRef(-1);

//   const gradientColors = index % 2 === 0 ? [ '#786586','#562F70','#562F70', '#786586'] : [ '#F1F6F3', '#BABBBA','#BABBBA','#F1F6F3',];
//   const heading = index % 2 === 0 ? styles.headWhite : styles.headBlack;
//   const categorys = index % 2 === 0 ? styles.headdespwhite : styles.headdespBlack;
//   const artistTextname = index % 2 === 0 ? styles.artistTextWhite : styles.artistTextBlack;
//   const Iconcolour = index % 2 === 0 ? styles.backIconWhite : styles.backIconBlack;
//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         style={styles.shadowContainer}
//         colors={gradientColors}
//         start={{ x: 0.10, y: 0 }}
//         end={{ x: 0.10, y: 1 }}
//       >
//         <View style={styles.cardTopRow}>
//           <View style={styles.halrow}>
//             <View style={{ flexDirection: 'column' }}>
//               <Text style={heading}>{item.title}</Text>
//               <Text style={categorys}>{item.category}</Text>
//             </View>
//           </View>
//           <View style={styles.moredot}>
//             <View style={[styles.smallDot, { backgroundColor: item.dot }]}></View>
//           </View>
//         </View>

//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             // style={[
//             //   styles.button,
//             //   {
//             //     backgroundColor: playingIndexRef.current === index ? 'black' : 'black',
//             //   },
//             // ]}
//             onPress={() => {
//               navigation.navigate('Music', { data: item, index: index });
//             }}
//           >
//              <MaterialCommunityIcons name="play-circle" size={30} color="#fff" />
//             {/* <Text style={styles.buttonText}>Play</Text> */}
//           </TouchableOpacity>
//         </View>

//         <View style={styles.infoContainer}>
//           <Text style={artistTextname}>
//             <EI size={25}  name="user" style={Iconcolour} />
//             {item.artist}
//           </Text>
//           <Text style={artistTextname}>
//             <EI size={25} color="white" name="calendar" style={Iconcolour} />
//             {item.date}
//           </Text>
//         </View>
//       </LinearGradient>
//     </View>
//   );
// };

// export default MusicListItems;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginVertical: 10,
//     borderRadius: 50,
//     paddingVertical: 10,
//     overflow: 'hidden',
//   },
//   shadowContainer: {
//     flex: 1,
//     borderRadius: 40,
//     paddingTop:10,
//     paddingHorizontal: 30,
//     paddingVertical: -10,
//     marginBottom: 10,
//     marginTop: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 20,
//     elevation: 40,
//   },
//   cardTopRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingBottom: 15,
//   },
//   halrow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   moredot: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   smallDot: {
//     width: 5,
//     height: 5,
//     borderRadius: 5,
//   },
//   headWhite: {
//     fontSize: 20,
//     textAlign: 'left',
//     color: 'white',
//     fontWeight: '600',
//   },
//   headBlack: {
//     fontSize: 20,
//     textAlign: 'left',
//     color: 'black',
//     fontWeight: '600',
//   },
//   head: {
//     fontSize: 20,
//     textAlign: 'left',
//     color: 'white',
//     fontWeight: '600',
//   },
//   headdespwhite: {
//     fontSize: 14,
//     color: 'white',
//   },
//   headdespBlack: {
//     fontSize: 14,
//     color: 'black',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   button: {
//     backgroundColor:'black',

   
//   },
//   buttonText: {
//     color: '#fff',
//   },
//   infoContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingTop: 2,
//     marginBottom: 20,
//   },
//   artistTextWhite: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     color: 'white',
//   },
//   artistTextBlack: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     color: 'black',
//   },
//   dateText: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     color: 'white',
//   },
//   backIconWhite: {
//     marginRight: 5,
//     color:'white'
//   },
//   backIconBlack: {
//     marginRight: 5,
//     color:'black'
//   },
// });
