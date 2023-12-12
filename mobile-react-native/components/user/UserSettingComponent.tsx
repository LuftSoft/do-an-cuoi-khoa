import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, Image, StyleSheet} from 'react-native';
import {CONFIG} from '../../utils/config';
import {CssUtil} from '../../utils/css.util';
import {useUserProvider} from '../../utils/user.context';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../overview/OverviewComponent';
import {FlatList} from 'react-native-gesture-handler';
import {Avatar, List, Button as PaperButton} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import {Helpers} from '../../utils/common.util';

type OverViewNavigationProp = StackNavigationProp<RootStackParamList, 'Test'>;
type Props = {
  navigation: OverViewNavigationProp;
};
const Stack = createStackNavigator();
type itemType = {id: string; title: string};
const UserSettingComponent: React.FC<Props> = ({navigation}) => {
  const {user, setUser} = useUserProvider();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [type, setType] = useState('');
  const [avatar, setAvatar] = useState(''); // To store image URI
  useEffect(() => {
    setAvatar(Helpers.arrayBufferToBase64(user?.user?.avatar?.data));
  }, []);
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
      <View style={styles.avatarContainer}>
        <Image
          source={
            avatar && avatar.length > 0
              ? {uri: 'data:image/png;base64,' + avatar}
              : require('../../assets/logo.jpg')
          }
          style={styles.avatar}
        />
      </View>
      <TextInput
        editable={false}
        style={styles.input}
        placeholder="Họ"
        value={user?.user?.firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        editable={false}
        style={styles.input}
        placeholder="Tên"
        value={user?.user?.lastName}
        onChangeText={setLastName}
      />
      <TextInput
        editable={false}
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={user?.user?.email}
        onChangeText={setEmail}
      />
      <TextInput
        editable={false}
        style={styles.input}
        placeholder="Ngày sinh"
        keyboardType="default" // Example; you can use a DatePicker component
        value={Helpers.convertToDate(user?.user?.dateOfBirth)}
        onChangeText={setDateOfBirth}
      />
      <TextInput
        editable={false}
        style={styles.input}
        placeholder="Loại"
        keyboardType="default"
        value={user?.user?.type === 'GV' ? 'Giảng viên' : 'Sinh viên'}
        onChangeText={setDateOfBirth}
      />
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={[
          {label: 'Nam', value: 'MALE'},
          {label: 'Nữ', value: 'FEMALE'},
        ]}
        disable
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Giới tính"
        value={user?.user?.gender}
        onChange={item => {
          console.log(item);
        }}
      />
      {/* <Button title="Select Avatar" onPress={handleAvatarSelect} />
      {avatar && <Image source={{uri: avatar}} style={styles.avatar} />} */}
      {/* <Button title="Lưu thay đổi" onPress={handleSubmit} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: '#404040',
  },
  dropdown: {
    marginBottom: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: '#ccc',
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
export default UserSettingComponent;
