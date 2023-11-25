import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CONFIG} from '../../utils/config';
import {CssUtil} from '../../utils/css.util';
import {useUserProvider} from '../../utils/user.context';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../overview/OverviewComponent';
import TestComponent from './TestComponent';
import TestDetailComponent from './TestDetailComponent';
import ResultDetailComponent from '../result/ResultDetailComponent';

type OverViewNavigationProp = StackNavigationProp<RootStackParamList, 'Test'>;
type Props = {
  navigation: OverViewNavigationProp;
};
const Stack = createStackNavigator();
const TestNavigator: React.FC<Props> = ({navigation}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{title: 'Đề thi của bạn'}}
        name="Test"
        component={TestComponent}
      />
      <Stack.Screen
        options={{title: 'Chi tiết đề thi'}}
        name="TestDetail"
        component={TestDetailComponent}
      />
      <Stack.Screen
        options={{title: 'Chi tiết kết quả'}}
        name="ResultDetail"
        component={ResultDetailComponent}
      />
    </Stack.Navigator>
  );
};
export default TestNavigator;
