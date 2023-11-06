import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {CssUtil} from '../../utils/css.util';
import {white} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import {useUserProvider} from '../../utils/user.context';
import {TestService} from './TestService';
import {CONFIG} from '../../utils/config';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../overview/OverviewComponent';
import {CommonUtil} from '../../utils/common.util';

type OverViewNavigationProp = StackNavigationProp<RootStackParamList, 'Test'>;
type Props = {
  navigation: OverViewNavigationProp;
};
const TestComponent: React.FC<Props> = ({navigation}) => {
  const {user, setUser} = useUserProvider();
  const [tests, setTests] = useState([]);
  const testData = [
    {name: 'Test 1', semester: 'Spring 2023', subject: 'Math'},
    {name: 'Test 2', semester: 'Fall 2023', subject: 'Science'},
    // Add more test data as needed
  ];
  console.log('test comp', user?.user?.id);
  useEffect(() => {
    const fetchData = async () => {
      await getInitData();
    };
    fetchData();
  }, []);
  const getInitData = async () => {
    await getTestByUserid(user?.user?.id);
  };
  const getTestByUserid = async (id: string) => {
    const response = await TestService.getTestByUserid(id);
    if (response.data?.code === CONFIG.API_RESPONSE_STATUS.SUCCESS) {
      setTests(response.data?.data);
      console.log('response ', response.data?.data);
    }
  };
  const handleDoExam = (id: string) => {
    navigation.navigate('TestDetail', {data: id});
  };
  const handleShowResult = () => {
    console.log('handleShowResult');
  };
  const canDoExam = (beginTime: string, time: number) => {
    const begin = new Date(beginTime).getTime();
    const end = new Date(beginTime).getTime() + time * 60 * 1000;
    const now = new Date().getTime();
    return true;
    return now >= begin && now <= end;
  };
  const boxShadow = CssUtil.GenerateDefaultBoxShadow();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Đề thi của bạn</Text>
      {tests.map((test: any, index) => (
        <View style={styles.card} key={index}>
          <Text>
            Tên: <Text style={styles.textBold}>{test?.test_name}</Text>
          </Text>
          <Text>Học kỳ: {test.semester_name}</Text>
          <Text>Lớp tín chỉ: {test.credit_class_name}</Text>
          <Text>Thời gian bắt đầu: {test.test_schedule_date}</Text>
          <Text>Thời gian làm bài: {test.test_time} phút</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={e => handleDoExam(test?.test_id)}
              disabled={!canDoExam(test.test_schedule_date, test.test_time)}>
              <Text style={styles.buttonText}>Làm bài</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleShowResult}>
              <Text style={styles.buttonText}>Kết quả</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderLeftColor: '#1976d2',
    borderLeftWidth: 5,
    shadowColor: '#171717',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonContainer: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#1976d2',
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonOutline: {
    borderColor: '#1976d2',
    borderWidth: 1,
    backgroundColor: '#fff',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
  buttonTextOutline: {
    color: '#fff',
  },
  textBold: {
    fontWeight: '700',
  },
});

export default TestComponent;
