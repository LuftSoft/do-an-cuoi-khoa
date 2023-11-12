import * as React from 'react';
import {BottomNavigation, Text} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './OverviewComponent';
import ResultComponent from '../result/ResultComponent';

export type OverViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Test'
>;
type Props = {
  navigation: OverViewNavigationProp;
};
const BottomNavigationComponent: React.FC<Props> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">xin chao</Text>
      <Text variant="bodyMedium">xin chao</Text>
      <Text variant="bodyMedium">xin chao</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderTopColor: '#000',
    borderTopWidth: 1,
  },
});
export default BottomNavigationComponent;
