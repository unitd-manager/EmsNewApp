import { useRoute } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Slider, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useEffect } from 'react';
const { height, width } = Dimensions.get('window')
import TrackPlayer, { Capability, usePlaybackState, useProgress, State } from 'react-native-track-player';
import { listData } from '../../api/constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { moderateScale } from '../../common/constants';
import EHeader from './EHeader';

const Music = () => {
    const route = useRoute();
    const progress = useProgress()
    const playbackState = usePlaybackState()
    const [currentAudio, setCurrentAudio] = useState(route.params.index);
    const ref = useRef()

    useEffect(() => {
        setTimeout(() => {
            ref.current.scrollToIndex({
                animated: true,
                index: currentAudio,
            })
        }, 500)
    }, []);

    useEffect(() => {
        setupPlayer();
    }, []);

    const setupPlayer = async () => {
        try {
            await TrackPlayer.setupPlayer();
            await TrackPlayer.updateOptions({
                // Media controls capabilities
                capabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious,
                    Capability.Stop,
                ],

                // Capabilities that will show up when the notification is in the compact form on Android
                compactCapabilities: [Capability.Play, Capability.Pause],
            });
            await TrackPlayer.add(listData);
            await TrackPlayer.skip(currentAudio);
            togglePlayback(playbackState)
        } catch (error) { }
    };

    const togglePlayback = async playbackState => {
        if (playbackState === State.Paused || playbackState === State.Ready || playbackState === State.Buffering || playbackState === State.Connecting) {
            await TrackPlayer.play();
        } else {
            await TrackPlayer.pause();
        }
    }

    return (
        <View style={styles.container}>
            <EHeader />
            <View>
                <FlatList
                    horizontal
                    ref={ref}
                    showsHorizontalScrollIndicator={false}
                    pageingEnabled
                    data={listData}
                    onScroll={async e => {
                        const x = e.nativeEvent.contentOffset.x / width;
                        setCurrentAudio(parseInt(x.toFixed(0)));
                        await TrackPlayer.skip(parseInt(x.toFixed(0)));
                        togglePlayback(playbackState);
                    }}
                    renderItem={({ item, index }) => {
                        return (
                          
                                <View style={styles.bannerView}>
                                    <Image source={item.artwork} style={styles.banner} />
                                    <Text style={styles.name}>Song : {item.title}</Text>
                                    <Text style={styles.name}>artist : {item.artist}</Text>
                                </View>
                        )
                    }}
                />

            </View>

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

            <View style={styles.btnArea}>
                <TouchableOpacity
                    onPress={async () => {
                        if (currentAudio > 0) {
                            setCurrentAudio(currentAudio - 1);
                            ref.current.scrollToIndex({
                                animated: true,
                                index: parseInt(currentAudio) - 1,
                            });
                            await TrackPlayer.skipToPrevious();
                            togglePlayback(playbackState)
                        }
                    }}>
                    <Text style={styles.icon}>
                        <AntDesign
                            name="stepbackward"
                            size={moderateScale(25)}
                            color={'#000'}
                        /></Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={async () => {
                        togglePlayback(playbackState);
                    }}>
                    {playbackState == State.Paused || playbackState == State.Ready ? <AntDesign
                        name="play"
                        size={moderateScale(40)}
                        color={'#000'}
                    /> : <AntDesign
                        name="pausecircle"
                        size={moderateScale(40)}
                        color={'#000'}
                    />}

                </TouchableOpacity>
                <TouchableOpacity
                    onPress={async () => {
                        if (listData.length - 1 > currentAudio) {
                            setCurrentAudio(currentAudio + 1)
                            ref.current.scrollToIndex({
                                animated: true,
                                index: parseInt(currentAudio) + 1,
                            })
                            await TrackPlayer.skipToNext();
                            togglePlayback(playbackState)
                        }
                    }}>
                    <Text style={styles.icon}> <AntDesign
                        name="stepforward"
                        size={moderateScale(25)}
                        color={'#000'}
                    />
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Music;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bannerView: {
        width: width,
        marginTop: 10,
    },
    banner: {
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        height: (height / 2) - 150,
        borderRadius: 10,
    },
    name: {
        marginTop: 20,
        fontSize: 15,
        marginLeft: 20,
        color: '#222',
    },
    sliderView: {
        marginTop: 20,
        alignSelf: 'center',
        width: '90%'
    },
    btnArea: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 50
    },
    icon: {
        fontSize: 30
    }
});