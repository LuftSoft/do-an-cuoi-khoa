import React from 'react';
import {TouchableOpacity, Image, StyleSheet, Text} from 'react-native';

const CustomRadioButton = (selected: any, onPress: any) => (
  <TouchableOpacity onPress={onPress} style={styles.radioButton}>
    {
      /* {selected ? (
      <Image source={require('./checked.png')} style={styles.checkedIcon} />
    ) : (
      <Image source={require('./unchecked.png')} style={styles.uncheckedIcon} />
      )} */
      selected ? (
        <Text style={[styles.checkedIcon]}>A</Text>
      ) : (
        <Text style={[styles.uncheckedIcon]}>A</Text>
      )
    }
  </TouchableOpacity>
);

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
    color: '#fff',
  },
  uncheckedIcon: {
    backgroundColor: '#fff',
    color: '#000',
  },
});

export default CustomRadioButton;
