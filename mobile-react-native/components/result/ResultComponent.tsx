import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CONFIG} from '../../utils/config';
import {CssUtil} from '../../utils/css.util';
import {useUserProvider} from '../../utils/user.context';
import {RootStackParamList} from '../overview/OverviewComponent';
import {ResultService} from './ResultService';
import {Helpers} from '../../utils/common.util';
import {ScrollView} from 'react-native-gesture-handler';

type OverViewNavigationProp = StackNavigationProp<RootStackParamList, 'Test'>;
type Props = {
  navigation: OverViewNavigationProp;
};
const ResultComponent: React.FC<Props> = ({navigation}) => {
  const {user, setUser} = useUserProvider();
  const [results, setResults] = useState([]);
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
    await getResultByUserId(user?.user?.id);
  };
  const getResultByUserId = async (id: string) => {
    const response = await ResultService.getResultByUserid(id);
    if (response.data?.code === CONFIG.API_RESPONSE_STATUS.SUCCESS) {
      setResults(response.data?.data);
      console.log('response result ', response.data?.data);
    }
  };

  const handleShowResult = (result: any) => {
    console.log(result.result_id);
    navigation.navigate('ResultDetail', {
      data: {
        id: result.result_id,
      },
    });
  };
  const boxShadow = CssUtil.GenerateDefaultBoxShadow();
  return (
    <ScrollView style={styles.container}>
      {results.map((result: any, index) => (
        <View style={styles.card} key={index}>
          <Text>
            Kỳ thi: <Text style={styles.textBold}>{result?.test_name}</Text>
          </Text>
          <Text>{result.semester_name}</Text>
          <Text>Lớp tín chỉ: {result.credit_class_name}</Text>
          <Text>
            Thời gian bắt đầu:{' '}
            {Helpers.convertToDateTime(result.test_schedule_date)}
          </Text>
          <Text>Thời gian làm bài: {result.test_time} phút</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonOutline}
              onPress={() => handleShowResult(result)}>
              <Text style={styles.buttonTextOutline}>Chi tiết</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
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

export default ResultComponent;
