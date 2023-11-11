/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {StackNavigationProp} from '@react-navigation/stack';
import type {PropsWithChildren} from 'react';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useUserProvider} from '../../utils/user.context';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Test: undefined;
  TestDetail: {data: any};
  Param: any;
};
type OverViewNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type Props = {
  navigation: OverViewNavigationProp;
};
const OverviewComponent: React.FC<Props> = ({navigation}) => {
  const {user, setUser} = useUserProvider();
  console.log('provider:', user);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const imagePath = require('../../assets/background.jpg');
  const backgroundLeftTop = require('../../assets/overview/left-top.png');
  const backgroundLeftRight = require('../../assets/overview/left-right.png');
  const handleTestDetail = () => {
    navigation.navigate('Test');
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={imagePath} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button]} onPress={handleTestDetail}>
            <Image source={backgroundLeftTop} style={[styles.background]} />
            <Text style={styles.buttonText}>Đề thi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Image source={backgroundLeftRight} style={[styles.background]} />
            <Text style={styles.buttonText}>Kết quả</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Button 3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Button 4</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footerContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flex: 2, // 30% of the screen height
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flex: 4, // 70% of the screen height
    paddingHorizontal: 10, // Optional: Add padding
    paddingTop: 10,
  },
  footerContainer: {
    flex: 4, // 70% of the screen height
    paddingHorizontal: 10, // Optional: Add padding
  },
  buttonRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5, // Optional: Adjust margin as needed
  },
  button: {
    flex: 1,
    backgroundColor: '#fff', // Optional: Add button styling
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    borderRadius: 15,
    marginHorizontal: 5, // Optional: Adjust margin as needed
    //box-shadow
    shadowColor: '#171717',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 20,
  },
  background: {
    flex: 1,
    position: 'absolute',
    borderRadius: 15,
    bottom: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
});

export default OverviewComponent;