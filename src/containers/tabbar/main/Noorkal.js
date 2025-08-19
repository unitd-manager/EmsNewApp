import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Noorkal = () => {
  return (
    <View style={styles.container}>
      <Text>Noorkal Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Noorkal;