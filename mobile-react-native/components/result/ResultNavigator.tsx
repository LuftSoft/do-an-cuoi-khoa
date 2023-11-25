import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CONFIG} from '../../utils/config';
import {CssUtil} from '../../utils/css.util';
import {useUserProvider} from '../../utils/user.context';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../overview/OverviewComponent';
import ResultComponent from './ResultComponent';
import ResultDetailComponent from './ResultDetailComponent';

type OverViewNavigationProp = StackNavigationProp<RootStackParamList, 'Test'>;
type Props = {
  navigation: OverViewNavigationProp;
};
const Stack = createStackNavigator();
const ResultNavigator: React.FC<Props> = ({navigation}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Result"
        options={{title: 'Kết quả thi'}}
        component={ResultComponent}
      />
      <Stack.Screen
        name="ResultDetail"
        options={{title: 'Chi tiết kết quả'}}
        component={ResultDetailComponent}
      />
    </Stack.Navigator>
  );
};
export default ResultNavigator;
