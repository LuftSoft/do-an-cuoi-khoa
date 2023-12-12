import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {CONFIG} from '../../utils/config';
import {CssUtil} from '../../utils/css.util';
import {useUserProvider} from '../../utils/user.context';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../overview/OverviewComponent';
import UserSettingComponent from './UserSettingComponent';
import {FlatList} from 'react-native-gesture-handler';
import {Avatar, IconButton} from 'react-native-paper';
import {Helpers} from '../../utils/common.util';

type OverViewNavigationProp = StackNavigationProp<RootStackParamList, 'Test'>;
type Props = {
  navigation: OverViewNavigationProp;
};
const Stack = createStackNavigator();
type itemType = {id: string; title: string; icon: string};
const UserSettingLayoutComponent: React.FC<Props> = ({navigation}) => {
  const ACCOUNT = 'account';
  const LOGOUT = 'logout';
  const {user, setUser} = useUserProvider();
  const [avatar, setAvatar] = useState<string>('');
  const handleTestDetail = () => {
    navigation.navigate('Test');
  };
  const settingsData: itemType[] = [
    {
      id: ACCOUNT,
      title: 'Tài khoản',
      icon: 'account-circle-outline',
    },
    {id: LOGOUT, title: 'Đăng xuất', icon: 'logout-variant'},
  ];

  useEffect(() => {
    init();
  }, []);
  const init = () => {
    // console.log(Helpers.arrayBufferToBase64(user?.user?.avatar?.data));
    setAvatar(Helpers.arrayBufferToBase64(user?.user?.avatar?.data));
  };
  const renderItem = ({item}: {item: itemType}) => {
    return (
      <TouchableOpacity
        onPress={() => handleSettingPress(item.id)}
        style={styles.settingItem}>
        <View style={styles.leftContent}>
          <IconButton icon={item.icon} />
          <Text style={styles.textItem}>{item.title}</Text>
        </View>
        <IconButton
          icon="arrow-right-drop-circle-outline"
          style={styles.rightIcon}
        />
      </TouchableOpacity>
    );
  };

  const handleSettingPress = (settingId: any) => {
    switch (settingId) {
      case ACCOUNT:
        navigation.navigate('Setting');
        break;
      case LOGOUT:
        setUser({
          user: null,
          accessToken: '',
          refreshToken: '',
        });
        navigation.navigate('Login');
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
        break;
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
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
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user?.user?.firstName}</Text>
          <Text style={styles.email}>{user?.user?.email}</Text>
        </View>
      </View>
      <FlatList
        style={{marginTop: 10}}
        data={settingsData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  settingItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#404040',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 10,
  },
  textItem: {
    alignItems: 'center',
    color: '#404040',
  },
  rightIcon: {
    alignSelf: 'flex-end',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#404040',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#888',
  },
});
export default UserSettingLayoutComponent;
