import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {View, Text, TextInput, Button, Image, StyleSheet} from 'react-native';
import {CONFIG} from '../../utils/config';
import {CssUtil} from '../../utils/css.util';
import {useUserProvider} from '../../utils/user.context';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../overview/OverviewComponent';
import {FlatList} from 'react-native-gesture-handler';
import {Avatar, List, Button as PaperButton} from 'react-native-paper';

type OverViewNavigationProp = StackNavigationProp<RootStackParamList, 'Test'>;
type Props = {
  navigation: OverViewNavigationProp;
};
const Stack = createStackNavigator();
type itemType = {id: string; title: string};
const UserSettingComponent: React.FC<Props> = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [type, setType] = useState('');
  const [avatar, setAvatar] = useState(''); // To store image URI

  // Function to handle form submission
  const handleSubmit = () => {
    // Process form data (e.g., send to server)
    console.log('Form Data:', {
      firstName,
      lastName,
      email,
      gender,
      dateOfBirth,
      type,
      avatar,
    });
  };

  // Function to handle avatar selection
  const handleAvatarSelect = () => {
    // Logic to select avatar image (e.g., from device)
    // For simplicity, it's just a placeholder
    setAvatar('../../assets/logo.jpg');
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <List.Accordion title="Accordion 1" id="1">
        <List.Item title="Item 1" />
        <List.Item title="Item 1" />
      </List.Accordion>
      <TextInput
        style={styles.input}
        placeholder="Date of Birth"
        keyboardType="numeric" // Example; you can use a DatePicker component
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
      />
      <List.Accordion title="Accordion 1" id="1">
        <List.Item title="Type 1" />
        <List.Item title="Type 1" />
      </List.Accordion>
      <Button title="Select Avatar" onPress={handleAvatarSelect} />
      {avatar && <Image source={{uri: avatar}} style={styles.avatar} />}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  avatar: {
    width: 150,
    height: 150,
    marginTop: 10,
    resizeMode: 'cover',
    borderRadius: 75,
  },
});
export default UserSettingComponent;
