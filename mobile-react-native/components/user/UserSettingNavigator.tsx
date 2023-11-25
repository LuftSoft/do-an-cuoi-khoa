import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CONFIG} from '../../utils/config';
import {CssUtil} from '../../utils/css.util';
import {useUserProvider} from '../../utils/user.context';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../overview/OverviewComponent';
import UserSettingComponent from './UserSettingComponent';
import UserSettingLayoutComponent from './UserSettingLayoutComponent';

type OverViewNavigationProp = StackNavigationProp<RootStackParamList, 'Test'>;
type Props = {
  navigation: OverViewNavigationProp;
};
const Stack = createStackNavigator();
const UserSettingNavigator: React.FC<Props> = ({navigation}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingLayout"
        options={{title: 'Cài đặt'}}
        component={UserSettingLayoutComponent}
      />
      <Stack.Screen
        name="Setting"
        options={{title: 'Thông tin cá nhân'}}
        component={UserSettingComponent}
      />
    </Stack.Navigator>
  );
};
export default UserSettingNavigator;
