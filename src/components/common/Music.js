import { useRoute } from '@react-navigation/native';
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Slider, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Sound from 'react-native-sound';
import { listData } from '../../api/constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { moderateScale } from '../../common/constants';
import EHeader from './EHeader';

const { height, width } = Dimensions.get('window');

const Music = () => {
    const route = useRoute();
    const [currentAudio, setCurrentAudio] = useState(route.params.index);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const ref = useRef();
    const progressInterval = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            ref.current.scrollToIndex({
                animated: true,
                index: currentAudio,
            });
        }, 500);
    }, []);

    useEffect(() => {
        loadSound(currentAudio);
        return () => {
            if (sound) {
                sound.release();
            }
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [currentAudio]);

    const loadSound = (index) => {
        if (sound) {
            sound.release();
            setSound(null);
            setIsPlaying(false);
            setProgress(0);
            setDuration(0);
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        }
        const track = listData[index];
        if (!track) return;
        // Assuming track has a 'url' or 'file' property with the audio file path
        // If artwork or other properties are used, keep them as is
        const soundInstance = new Sound(track.url || track.file || '', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('Failed to load the sound', error);
                return;
            }
            setDuration(soundInstance.getDuration());
            setSound(soundInstance);
            playSound(soundInstance);
        });
    };

    const playSound = (soundInstance) => {
        soundInstance.play((success) => {
            if (success) {
                // Auto play next track when current finishes
                if (currentAudio < listData.length - 1) {
                    setCurrentAudio(currentAudio + 1);
                    ref.current.scrollToIndex({
                        animated: true,
                        index: currentAudio + 1,
                    });
                } else {
                    setIsPlaying(false);
                    setProgress(0);
                    if (progressInterval.current) {
                        clearInterval(progressInterval.current);
                    }
                }
            } else {
                console.log('Playback failed due to audio decoding errors');
            }
        });
        setIsPlaying(true);
        progressInterval.current = setInterval(() => {
            soundInstance.getCurrentTime((seconds) => {
                setProgress(seconds);
            });
        }, 1000);
    };

    const pauseSound = () => {
        if (sound) {
            sound.pause();
            setIsPlaying(false);
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        }
    };

    const togglePlayback = () => {
        if (!sound) return;
        if (isPlaying) {
            pauseSound();
        } else {
            playSound(sound);
        }
    };

    const seekTo = (value) => {
        if (sound) {
            sound.setCurrentTime(value);
            setProgress(value);
        }
    };

    const skipToPrevious = () => {
        if (currentAudio > 0) {
            setCurrentAudio(currentAudio - 1);
            ref.current.scrollToIndex({
                animated: true,
                index: currentAudio - 1,
            });
        }
    };

    const skipToNext = () => {
        if (currentAudio < listData.length - 1) {
            setCurrentAudio(currentAudio + 1);
            ref.current.scrollToIndex({
                animated: true,
                index: currentAudio + 1,
            });
        }
    };

    return (
        <View style={styles.container}>
            <EHeader />
            <View>
                <FlatList
                    horizontal
                    ref={ref}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    data={listData}
                    onScroll={e => {
                        const x = e.nativeEvent.contentOffset.x / width;
                        const index = parseInt(x.toFixed(0));
                        if (index !== currentAudio) {
                            setCurrentAudio(index);
                        }
                    }}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.bannerView}>
                                <Image source={item.artwork} style={styles.banner} />
                                <Text style={styles.name}>Song : {item.title}</Text>
                                <Text style={styles.name}>artist : {item.artist}</Text>
                            </View>
                        );
                    }}
                />
            </View>

            <View style={styles.sliderView}>
                <Slider
                    value={progress}
                    maximumValue={duration}
                    minimumValue={0}
                    thumbStyle={{ width: 20, height: 20 }}
                    thumbTintColor={'black'}
                    onValueChange={value => {
                        seekTo(value);
                    }}
                />
            </View>

            <View style={styles.btnArea}>
                <TouchableOpacity onPress={skipToPrevious}>
                    <Text style={styles.icon}>
                        <AntDesign name="stepbackward" size={moderateScale(25)} color={'#000'} />
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={togglePlayback}>
                    {isPlaying ? (
                        <AntDesign name="pausecircle" size={moderateScale(40)} color={'#000'} />
                    ) : (
                        <AntDesign name="play" size={moderateScale(40)} color={'#000'} />
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={skipToNext}>
                    <Text style={styles.icon}>
                        <AntDesign name="stepforward" size={moderateScale(25)} color={'#000'} />
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

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
        height: height / 2 - 150,
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
        width: '90%',
    },
    btnArea: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 50,
    },
    icon: {
        fontSize: 30,
    },
});
