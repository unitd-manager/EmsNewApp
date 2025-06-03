import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const RadioButton = ({ label, isChecked, onSelect,textColor }) => {
  return (
    <TouchableOpacity onPress={onSelect}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <FontAwesome5
          name={isChecked ? 'dot-circle' : 'circle'}
          size={20}
          color='black'
        />
        <Text style={{ marginLeft: 8,color:'black' }}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RadioButton;
