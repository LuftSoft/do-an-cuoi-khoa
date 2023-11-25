import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import OverviewComponent, {RootStackParamList} from './OverviewComponent';
import UserSettingLayoutComponent from '../user/UserSettingLayoutComponent';
import TestComponent from '../test/TestComponent';
import ResultComponent from '../result/ResultComponent';
import UserSettingNavigator from '../user/UserSettingNavigator';
import ResultNavigator from '../result/ResultNavigator';
import TestNavigator from '../test/TestNavigator';
import {Button, IconButton} from 'react-native-paper';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
type OverViewNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type Props = {
  navigation: OverViewNavigationProp;
};
const Stack = createStackNavigator();
const MainNavigation: React.FC<Props> = ({navigation}) => {
  const handleGetComponent = (page: string) => {
    console.log(page);
  };
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'white',
          paddingTop: 5,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: '#1976d2',
        tabBarInactiveTintColor: '#404040',
      }}>
      <Tab.Screen
        name="Trang chủ"
        component={OverviewComponent}
        options={{
          tabBarIcon: tabInfo => {
            return (
              <IconButton
                iconColor={tabInfo.focused ? '#1976d2' : '#404040'}
                icon="home-circle-outline"
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Thi"
        component={TestNavigator}
        options={{
          headerShown: false,
          title: 'Thi',
          tabBarIcon: tabInfo => {
            return (
              <IconButton
                iconColor={tabInfo.focused ? '#1976d2' : '#404040'}
                icon="file-document-edit-outline"
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Kết quả"
        component={ResultNavigator}
        options={{
          headerShown: false,
          tabBarIcon: tabInfo => {
            return (
              <IconButton
                iconColor={tabInfo.focused ? '#1976d2' : '#404040'}
                icon="clipboard-check-multiple-outline"
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Cài đặt"
        component={UserSettingNavigator}
        options={{
          headerShown: false,
          tabBarIcon: tabInfo => {
            return (
              <IconButton
                iconColor={tabInfo.focused ? '#1976d2' : '#404040'}
                icon="account-circle-outline"
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};
export default MainNavigation;
