import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CONFIG} from '../../utils/config';
import {CssUtil} from '../../utils/css.util';
import {useUserProvider} from '../../utils/user.context';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../overview/OverviewComponent';
import UserSettingComponent from './UserSettingComponent';
import {FlatList} from 'react-native-gesture-handler';
import {IconButton} from 'react-native-paper';

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
      <FlatList
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
  },
  settingItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
    justifyContent: 'space-between',
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
});
export default UserSettingLayoutComponent;
