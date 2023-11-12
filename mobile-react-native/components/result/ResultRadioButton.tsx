import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  GestureResponderEvent,
  View,
} from 'react-native';

const ResultRadioButton = (props: any) => {
  var {options} = props;
  const getStyle = () => {
    switch (options.type) {
      case 'highlight':
        return styles.checkedIcon;
      case 'wrong':
        return styles.wrongIcon;
      case 'default':
        return styles.uncheckedIcon;
      default:
        return styles.uncheckedIcon;
    }
  };
  return (
    <View>
      <TouchableOpacity style={[styles.radioButton, getStyle()]}>
        <Text style={getStyle()}>{options.text}</Text>
      </TouchableOpacity>
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
  wrongIcon: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
    color: '#fff',
  },
});

export default ResultRadioButton;
