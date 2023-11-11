import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  GestureResponderEvent,
  View,
} from 'react-native';

const CustomRadioButton = (props: any) => {
  var {options, onPress} = props;
  return (
    <View>
      {options.selected ? (
        <TouchableOpacity
          onPress={onPress}
          style={[styles.radioButton, styles.checkedIcon]}>
          <Text style={styles.checkedIcon}>{options.text}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          style={[styles.radioButton, styles.uncheckedIcon]}>
          <Text style={styles.uncheckedIcon}>{options.text}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  radioButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedIcon: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
    color: '#fff',
  },
  uncheckedIcon: {
    backgroundColor: '#ccc',
    color: '#fff',
    borderColor: '#ccc',
  },
});

export default CustomRadioButton;
