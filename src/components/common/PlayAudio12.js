import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Button, StyleSheet, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TrackPlayer from 'react-native-track-player';
import Sound from 'react-native-sound';
import api from '../../api/api';
import { setupPlayer } from './trackPlayerServices'; // Ensure you have your TrackPlayer setup here

const AudioPlayer = () => {
  const [listData, setListData] = useState([]);  // Initialize with an empty array
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isTrackPlaying, setIsTrackPlaying] = useState(false); // Separate state for TrackPlayer
  const [localIsPlaying, setLocalIsPlaying] = useState(false); // Separate state for local sound
  const [sound, setSound] = useState(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setupPlayer();
    fetchAudioFromAPI();
    return () => {
      TrackPlayer.destroy(); // Clean up TrackPlayer when component unmounts
    };
  }, []);

  // Fetch audio from the API
  const fetchAudioFromAPI = () => {
    api
      .get('/content/getAudioGallery', {
        params: {
          page: 1, // Sample page
          pageSize: 8,
        },
      })
      .then((res) => {
        const serverPath = 'http://43.228.126.245/EMS-API/storage/uploads/';
        const audioData = res.data.data.map((item, index) => ({
          id: index.toString(), // Generate unique ID for each track
          title: item.title,
          url: serverPath + item.file_name,
          artist: 'Unknown Artist', // Provide a default or dynamic artist
        }));
        setListData(audioData);

        // Add tracks to TrackPlayer queue
        TrackPlayer.add(audioData);
      })
      .catch((error) => {
        console.error("Error fetching audio data:", error);
      });
  };

  // Handle play/pause with TrackPlayer for online audio
  const playPauseTrack = async (index) => {
    try {
      if (currentTrackIndex === index && isTrackPlaying) {
        await TrackPlayer.pause();
        setIsTrackPlaying(false);
      } else {
        if (currentTrackIndex !== null) {
          await TrackPlayer.pause();
        }
        await TrackPlayer.skip(index); // Use track ID to skip
        await TrackPlayer.play();
        setCurrentTrackIndex(index);
        setIsTrackPlaying(true);
      }
    } catch (error) {
      console.error("Error handling play/pause:", error);
    }
  };

  // Local sound handling with react-native-sound
  const loadLocalSound = () => {
    const newSound = new Sound('your-local-audio-file.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      setDuration(newSound.getDuration()); // Get duration of the sound
      setSound(newSound);
    });
  };

  const playLocalSound = () => {
    if (sound) {
      sound.play((success) => {
        if (success) {
          console.log('Finished playing local sound');
        } else {
          console.log('Local sound playback failed');
        }
        setLocalIsPlaying(false);
      });
      setLocalIsPlaying(true);
    }
  };

  const stopLocalSound = () => {
    if (sound) {
      sound.stop(() => {
        sound.release();
      });
      setLocalIsPlaying(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        placeholderTextColor="black"
        onChangeText={(text) => setSearchQuery(text)}
      />
      <ScrollView>
        {listData.length > 0 ? (  // Add a check to avoid .map on undefined or empty list
          listData.map((item, index) => (
            <View style={styles.singleContainer} key={index}>
              <View style={styles.cardTopRow}>
                <Text style={styles.titleText}>{item.title}</Text>
              </View>
              <TouchableOpacity onPress={() => playPauseTrack(index)}>
                <AntDesign
                  name={isTrackPlaying && currentTrackIndex === index ? 'pausecircle' : 'play'}
                  size={25}
                  color={'#000'}
                />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text>No audio files available</Text> // Optional message if list is empty
        )}
      </ScrollView>

      {/* Buttons for playing local sound */}
      <Text>Local Audio Player</Text>
      <Button title="Load Local Sound" onPress={loadLocalSound} />
      <Button
        title={localIsPlaying ? "Pause Local" : "Play Local"}
        onPress={localIsPlaying ? stopLocalSound : playLocalSound}
      />
      <Text>Duration: {duration ? duration.toFixed(2) : 0} seconds</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 10 },
  singleContainer: { backgroundColor: '#fff', padding: 10, marginVertical: 10, borderRadius: 10 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleText: { fontSize: 16, fontWeight: 'bold', color: '#117a4c' },
  searchInput: { height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, borderRadius: 8, paddingLeft: 10 },
});

export default AudioPlayer;
