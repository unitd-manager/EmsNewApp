import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Checkbox = ({ label, isChecked, onChange }) => {
  return (
    <TouchableOpacity onPress={onChange}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <FontAwesome5
          name={isChecked ? 'check-square' : 'square'}
          size={20}
        />
        <Text style={{ marginLeft: 8 }}>{label}</Text>
      </View>
    </TouchableOpacity>

  );
};

export default Checkbox;
