import React, { useState, useRef } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator, LayoutAnimation, UIManager, Image,StyleSheet, Platform  } from "react-native";
import Video from "react-native-video";
import Slider from 'react-native-slider';
import { toHHMMSS } from "./utils";
//import { Images } from "./assets/index";
import Icon from "react-native-vector-icons/FontAwesome";


UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const volumeControlTime = 3000;
 
export const AudioPlayer = (props) => {
  const { url, style, repeatOnComponent, repeatOffComponent } = props;
  const [paused, setPaused] = useState(true);

  const videoRef = useRef(null);
  const controlTimer = useRef(0);

  const [totalLength, setTotalLength] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [volumeControl, setVolumeControl] = useState(false);
  const [repeat, setRepeat] = useState(false);
console.log('toHHMMSS(totalLength)',toHHMMSS(totalLength));

console.log('toHHMMSS(currentPosition)',toHHMMSS(currentPosition));
  const onSeek = (time) => {
    time = Math.round(time);
    videoRef && videoRef.current.seek(time);
    setCurrentPosition(time);
    setPaused(false);
  };

  const fixDuration = (data) => {
    setLoading(false);
    setTotalLength(Math.floor(data.duration));
  };

  const setTime = (data) => {
    setCurrentPosition(Math.floor(data.currentTime));
  };

  const togglePlay = () => {
    setPaused(!paused);
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
  };

  const toggleVolumeControl = () => {
    setVolumeTimer(!volumeControl);
    LayoutAnimation.easeInEaseOut();
    setVolumeControl(!volumeControl);
  };

  const setVolumeTimer = (setTimer = true) => {
    clearTimeout(controlTimer.current);
    controlTimer.current = 0;
    if (setTimer) {
      controlTimer.current = setTimeout(() => {
        LayoutAnimation.easeInEaseOut();
        setVolumeControl(false);
      }, volumeControlTime);
    }
  };

  const onVolumeChange = (vol) => {
    setVolumeTimer();
    setVolume(vol);
  };

  const resetAudio = () => {
    if (!repeat) {
      setPaused(true);
    }
    setCurrentPosition(0);
  };

  return (
    <View style={[style && style, {}]}>
      <Video
        source={{ uri: `http://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3` }}
        ref={videoRef}
        playInBackground={false}
        audioOnly={true}
        playWhenInactive={false}
        paused={paused}
        onEnd={resetAudio}
        onLoad={fixDuration}
        onLoadStart={() => setLoading(true)}
        onProgress={setTime}
        volume={volume}
        repeat={repeat}
        style={{ height: 0, width: 0 }}
      />
       
      <View>
        <View style={styles.rowContainer}>
          {loading && (
            <View style={{ margin: 18 }}>
              <ActivityIndicator size="large" color="#FFF"/>
            </View>
          ) || (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
                style={styles.iconContainer}
                onPress={toggleRepeat}
              >
               <Icon name="repeat" size={25} 
          color="grey" />
                {/* <Image source={Images.repeatIcon} style={styles.playIcon}/> */}
                {!repeat && <View style={styles.crossLine}/>}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconContainer, styles.playBtn]} onPress={togglePlay}>
                {/* <Image
                  source={paused ? Images.playIcon : Images.pauseIcon}
                  style={styles.playIcon}
                /> */}
                
         <Icon name={paused ? "play":"pause"} size={25} 
          color="grey" />

              </TouchableOpacity>
              <View
                style={[
                  styles.volumeControlContainer,
                  volumeControl ? { paddingHorizontal: 12 } : { backgroundColor: "transparent" }
                ]}
              >
                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
                  style={styles.iconContainer}
                  onPress={toggleVolumeControl}
                >
                  {/* <Image
                    source={volume === 0 ? Images.muteIcon : Images.soundIcon}
                    style={styles.playIcon}
                  /> */}
                   <Icon 
          name={volume === 0 ? "volume-off" : "volume-up"} 
          size={25} 
          color="grey" 
        />
                                  </TouchableOpacity>
                {volumeControl && (
                  <Slider
                    style={styles.volumeSlider}
                    minimumValue={0}
                    maximumValue={1}
                    minimumTrackTintColor={'#fff'}
                    maximumTrackTintColor={'grey'}
                    thumbTintColor={'#fff'}
                    onSlidingComplete={onVolumeChange}
                    value={volume}
                  />
                )}
              </View>
            </View>
          )}

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={Math.max(totalLength, 1, currentPosition + 1)}
              minimumTrackTintColor={'#fff'}
              maximumTrackTintColor={'grey'}
              onSlidingComplete={onSeek}
              value={currentPosition}
            />
           
            <View style={styles.durationContainer}>
              <Text size={25} 
          color="grey" >
                {toHHMMSS(currentPosition)}
              </Text>
              <Text size={25} 
          color="grey" >
                {toHHMMSS(totalLength)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  rowContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  iconContainer: {
    alignSelf: "center",
    position: "relative",
  },
  playBtn: {
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    width: "100%",
  },
  slider: {
    height: 30,
    width: "100%",
    marginBottom: 3,
  },
  durationContainer: { flexDirection: "row", justifyContent: "space-between",marginTop:5 },
  actionsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "90%",
    marginBottom: 10,
  },
  crossLine: {
    position: "absolute",
    transform: [ {rotate: "-60deg"} ],
    top: 15,
    left: -1,
    width: 30,
    height: 1,
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
  },
  volumeControlContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#00000099",
    paddingHorizontal: 16,
    borderRadius: 50,
    ...Platform.select({
      ios: {
        height: 44
      },
      android: {
        height: 40
      },
    }),
  },
  volumeSlider: {
    width: '50%',
  },
  timeText: {
    color: '#fff',
    fontSize: 18,
  },
  
  playIcon: { height: 30, width: 30, resizeMode: 'contain' },
});