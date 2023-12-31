import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {CssUtil} from '../../utils/css.util';
import {white} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import {useUserProvider} from '../../utils/user.context';
import {TestService} from './TestService';
import {CONFIG} from '../../utils/config';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../overview/OverviewComponent';
import {CommonUtil, Helpers} from '../../utils/common.util';
import {ResultService} from '../result/ResultService';
import dayjs from 'dayjs';
import {ScrollView} from 'react-native-gesture-handler';

type OverViewNavigationProp = StackNavigationProp<RootStackParamList, 'Test'>;
type Props = {
  navigation: OverViewNavigationProp;
};
const TestComponent: React.FC<Props> = ({navigation}) => {
  const {user, setUser} = useUserProvider();
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  console.log('test comp', user?.user?.id);
  useEffect(() => {
    navigation.addListener('focus', async () => {
      await getInitData();
    });
    const fetchData = async () => {
      await getInitData();
    };
    fetchData();
  }, [navigation]);
  const getInitData = async () => {
    await getTestByUserid(user?.user?.id);
    await getResultByUserId(user?.user?.id);
    //filter the test already has result;
    // const resultCopyId = Helpers.cloneDeep(
    //   results.map((item: any) => item.credit_class_id),
    // );
    // const testCopy = Helpers.cloneDeep(tests);
    // console.log(testCopy);
    // testCopy.forEach((item: any) => {
    //   if (resultCopyId.includes(item.credit_class_id)) {
    //     item.has_result = true;
    //   }
    // });
    // setTests(testCopy);
    // console.log('testCopy', testCopy);
  };
  const getTestByUserid = async (id: string) => {
    const response = await TestService.getTestByUserid(id);
    if (response.data?.code === CONFIG.API_RESPONSE_STATUS.SUCCESS) {
      const now = new Date().getTime();
      const data =
        response.data?.data?.filter(
          (item: any) => new Date(item.test_schedule_date).getTime() >= now,
        ) || [];
      // .sort(
      //   (a: any, b: any) => b.test_schedule_date - a.test_schedule_date,
      // ), sort theo ngay giam dan
      setTests(
        response.data?.data?.sort(
          (a: any, b: any) =>
            new Date(b.test_schedule_date).getTime() -
            new Date(a.test_schedule_date).getTime(),
        ),
      );
      console.log(
        'response sort',
        response.data?.data?.sort(
          (a: any, b: any) => b.test_schedule_date - a.test_schedule_date,
        ),
      );
    }
  };
  const getResultByUserId = async (id: string) => {
    const response = await ResultService.getResultByUserid(id);
    if (response.data?.code === CONFIG.API_RESPONSE_STATUS.SUCCESS) {
      setResults(response.data?.data);
      console.log('response result ', response.data?.data);
    }
  };
  const handleDoExam = (test: any) => {
    console.log(test);
    navigation.navigate('TestDetail', {
      data: {
        id: test.test_id,
        test_credit_class_id: test.id,
        test_schedule_date: test.test_schedule_date,
      },
    });
  };
  const handleShowResult = (testId: any) => {
    navigation.navigate('ResultDetail', {
      data: {
        id: testId,
      },
    });
  };
  const canDoExam = (beginTime: string, time: number) => {
    const begin = new Date(beginTime).getTime();
    const end = new Date(beginTime).getTime() + time * 60 * 1000;
    const now = new Date().getTime();
    return now >= begin && now <= end;
  };
  const expiredTime = (beginTime: string, time: number) => {
    const end = new Date(beginTime).getTime() + time * 60 * 1000;
    const now = new Date().getTime();
    return now >= end;
  };
  const boxShadow = CssUtil.GenerateDefaultBoxShadow();
  const isResultExists = (test_credit_class_id: string) => {
    //tests.id is test_credit_class_id
    return (
      results.filter((item: any) => item.id === test_credit_class_id).length > 0
    );
  };
  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.container}>
        {tests.map((test: any, index) => (
          <View style={styles.card} key={index}>
            <Text>
              Tên: <Text style={styles.textBold}>{test?.test_name}</Text>
            </Text>
            <Text>Học kỳ: {test.semester_name}</Text>
            <Text>Lớp tín chỉ: {test.credit_class_name}</Text>
            <Text>
              Thời gian bắt đầu:{' '}
              {Helpers.convertToDateTime(test.test_schedule_date)}
            </Text>
            <Text>Thời gian làm bài: {test.test_time} phút</Text>
            <View style={styles.buttonContainer}>
              {isResultExists(test.id) ? (
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: '#05c46b'}]}
                  disabled>
                  <Text style={styles.buttonText}>Đã hoàn thành</Text>
                </TouchableOpacity>
              ) : expiredTime(test.test_schedule_date, test.test_time) ? (
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: '#e84118'}]}
                  disabled>
                  <Text style={[styles.buttonText]}>Đã hết hạn</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.button,
                    canDoExam(test.test_schedule_date, test.test_time)
                      ? null
                      : {backgroundColor: '#bbd9f7'},
                  ]}
                  onPress={e => handleDoExam(test)}
                  disabled={
                    !canDoExam(test.test_schedule_date, test.test_time)
                  }>
                  <Text style={[styles.buttonText]}>Làm bài</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
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
    marginTop: 10,
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
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
  buttonTextOutline: {
    color: '#1976d2',
  },
  textBold: {
    fontWeight: '700',
  },
});

export default TestComponent;
