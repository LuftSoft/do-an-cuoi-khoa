/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {StackNavigationProp} from '@react-navigation/stack';
import type {PropsWithChildren} from 'react';
import React, {useEffect, useState} from 'react';
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
import {CommonService} from './CommonService';
import {CONFIG} from '../../utils/config';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Test: undefined;
  Result: undefined;
  ResultDetail: {data: any};
  TestDetail: {data: any};
  Param: any;
  BottomNavigation: undefined;
  SettingLayout: undefined;
  Setting: undefined;
};
type OverViewNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type Props = {
  navigation: OverViewNavigationProp;
};
const OverviewComponent: React.FC<Props> = ({navigation}) => {
  const {user, setUser} = useUserProvider();
  const isDarkMode = useColorScheme() === 'dark';
  const [userInfo, setUserInfo] = useState<any>({});
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const imagePath = require('../../assets/background.jpg');
  const backgroundLeftTop = require('../../assets/overview/left-top.png');
  const backgroundLeftRight = require('../../assets/overview/left-right.png');
  const backgroundLeftBottom = require('../../assets/overview/bottom-left.png');
  const backgroundRightBottom = require('../../assets/overview/bottom-right.png');
  navigation.addListener('focus', async () => {
    await getInitData();
  });
  useEffect(() => {
    const fetchData = async () => {
      await getInitData();
    };
    fetchData();
  }, []);
  const getInitData = async () => {
    try {
      const response = await CommonService.getUserInfo(user?.user?.id);
      if (response.data?.code === CONFIG.API_RESPONSE_STATUS.SUCCESS) {
        console.log('response.data?.data', response.data?.data);
        setUserInfo(response.data?.data || {});
      }
    } catch (err) {
      console.log('err when get test detail', err);
    }
  };
  const handleTestDetail = () => {
    navigation.navigate('Test');
  };
  const handleResultDetail = () => {
    navigation.navigate('Result');
  };
  const handleLogout = () => {
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
  };
  const handleSetting = () => {
    navigation.navigate('SettingLayout');
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
          <TouchableOpacity style={styles.button} onPress={handleResultDetail}>
            <Image source={backgroundLeftRight} style={[styles.background]} />
            <Text style={styles.buttonText}>Kết quả</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleSetting}>
            <Image source={backgroundLeftBottom} style={[styles.background]} />
            <Text style={styles.buttonText}>Cài đặt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Image source={backgroundRightBottom} style={[styles.background]} />
            <Text style={styles.buttonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.footerItem}>
          <Text style={styles.footerItemText}>
            Tổng bài thi: {userInfo.tests}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.footerItemText}>
            Bài thi chưa làm: {userInfo.current_test}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.footerItemText}>
            Điểm trung bình các bài thi: {userInfo.mark}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.footerItemText}>
            Số bài thi đã làm: {userInfo.results}
          </Text>
        </View>
      </View>
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
    backgroundColor: '#f5f5f0',
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
    flex: 3, // 70% of the screen height
    paddingHorizontal: 10, // Optional: Add padding
    paddingTop: 10,
    marginBottom: 20,
  },
  footerContainer: {
    flex: 4, // 70% of the screen height
    paddingHorizontal: 10, // Optional: Add padding
  },
  footerItem: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 15,
    shadowColor: '#171717',
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    alignItems: 'center',
  },
  footerItemText: {
    color: '#000',
    fontSize: 18,
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
