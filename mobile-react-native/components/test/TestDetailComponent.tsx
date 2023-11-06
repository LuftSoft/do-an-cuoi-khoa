import {StackNavigationProp} from '@react-navigation/stack';
import {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {CONFIG} from '../../utils/config';
import CustomRadioButton from '../common/radio.button';
import {RootStackParamList} from '../overview/OverviewComponent';
import {QuestionModel, TestModel} from './TestModel';
import {TestService} from './TestService';
import Toast from 'react-native-toast-message';
import {ToastUtil} from '../../utils/toast.util';

type OverViewNavigationProp = StackNavigationProp<RootStackParamList, 'Test'>;
type Props = {
  navigation: OverViewNavigationProp;
};
const TestDetailComponent: React.FC<Props> = ({navigation}) => {
  const [test, setTest] = useState({
    questions: [] as QuestionModel[],
  } as TestModel);
  const [questions, setQuestions] = useState([] as QuestionModel[]);
  const [answers, setAnswers] = useState([]);
  const data = navigation
    .getState()
    .routes.filter(item => item.name === 'TestDetail')[0];
  const id = data.params?.data;
  console.log(
    navigation.getState().routes.filter(item => item.name === 'TestDetail')[0]
      .params,
  );
  useEffect(() => {
    const fetchData = async () => {
      await getInitData();
    };
    fetchData();
  }, []);
  const getInitData = async () => {
    await getTestByUserid(id);
  };
  const getTestByUserid = async (id: string) => {
    try {
      const response = await TestService.getTestDetail(id);
      if (response.data?.code === CONFIG.API_RESPONSE_STATUS.SUCCESS) {
        var testResponse = response.data?.data as TestModel;
        setTest(testResponse);
        setQuestions(testResponse.questions);
        ToastUtil.info('qq', 'ne');
      }
    } catch (err) {
      console.log('err when get test detail', err);
    }
  };
  const handleValueChange = (item: any, value: string) => {
    setQuestions(
      questions.map(item => {
        if (item.id === id) {
          item.answer = value;
        }
        return item;
      }),
    );
    item.answer = value;
    console.log(value);
  };
  return (
    <View style={styles.container}>
      {/* Information Bar */}
      <View style={styles.infoBar}>
        {/* Time Count */}
        <Text>Time: 00:00</Text>
        <Text>Xem bài làm</Text>
        <Text>Nộp bài</Text>
        {/* Other info */}
      </View>

      {/* List of Questions */}
      <FlatList
        data={questions || []}
        keyExtractor={item => item?.id.toString()}
        renderItem={({item}) => (
          // Render each question here
          <View style={styles.questionContainer}>
            <Text>{item.question}</Text>
            <RadioButton.Group
              onValueChange={value => (item.answer = value)}
              value={'answer_c'}
              key={item.id}>
              <CustomRadioButton
                key={item.id}
                selected={item.answer === ''}
                onPress={() => {
                  // Handle radio button press
                  // Update the selected value based on item.value
                }}></CustomRadioButton>
              <Text>{item.question}</Text>
              <RadioButton.Item
                label={item.answer_b}
                value="answer_b"
                position="leading"
                color="#1976d2"
                labelStyle={styles.labelRadioButton}
              />
              <RadioButton.Item
                label={item.answer_c}
                value="answer_c"
                position="leading"
                color="#1976d2"
                labelStyle={styles.labelRadioButton}
              />
              <RadioButton.Item
                label={item.answer_d}
                value="answer_d"
                position="leading"
                color="#1976d2"
                labelStyle={styles.labelRadioButton}
              />
            </RadioButton.Group>
          </View>
        )}
      />
      <View style={styles.questionClusterBar}>
        <Text>1-5</Text>
        <Text>5-10</Text>
        <Text>10-15</Text>
        <Text>15-20</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoBar: {
    padding: 10,
    backgroundColor: 'lightgray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionContainer: {
    margin: 10,
  },
  questionClusterBar: {
    flexDirection: 'row',
    gap: 5,
  },
  labelRadioButton: {
    position: 'absolute',
    left: 55,
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default TestDetailComponent;
