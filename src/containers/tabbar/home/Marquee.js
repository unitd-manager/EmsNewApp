import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, Animated,TouchableOpacity } from 'react-native';

const Marquee = ({ text, onPress }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();

  useEffect(() => {
    const startScroll = () => {
      Animated.loop(
        Animated.timing(scrollX, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true
        })
      ).start();
    };

    startScroll();
  }, []);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ overflow: 'hidden', backgroundColor: 'red', marginLeft: 15, marginRight: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={scrollRef}
          scrollEnabled={false}
        >
          <Animated.View
            style={{
              flexDirection: 'row',
              transform: [
                {
                  translateX: scrollX.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -1000] // Adjust this value based on your content length
                  })
                }
              ]
            }}
          >
            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', marginLeft: 13 }}>{text}</Text>
          </Animated.View>
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
};

export default Marquee;

