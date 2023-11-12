import {StackNavigationProp} from '@react-navigation/stack';
import {useEffect, useRef, useState} from 'react';
import {Button, FlatList, StyleSheet, Text, View} from 'react-native';
import {Portal, RadioButton} from 'react-native-paper';
import {CONFIG} from '../../utils/config';
import ResultRadioButton from './ResultRadioButton';
import {RootStackParamList} from '../overview/OverviewComponent';
import {QuestionModel, TestModel} from '../test/TestModel';
import {TestService} from '../test/TestService';
import Toast from 'react-native-toast-message';
import {ToastUtil} from '../../utils/toast.util';
import {ConfirmDialogComponent} from '../common/confirm.dialog';
import {
  ConfirmDialogDataModel,
  InitValuesConfirmDialogData,
  TestResultDialogDataModel,
} from '../common/common.model';
import {useUserProvider} from '../../utils/user.context';
import {Helpers} from '../../utils/common.util';
import {ResultService} from './ResultService';

type OverViewNavigationProp = StackNavigationProp<RootStackParamList, 'Test'>;
type Props = {
  navigation: OverViewNavigationProp;
};
const ResultDetailComponent: React.FC<Props> = ({navigation}) => {
  const [test, setTest] = useState({
    questions: [] as QuestionModel[],
  } as TestModel);
  const [results, setResults] = useState<any>({});
  const timerIntervalRef = useRef<any>({interval: null, initTime: 0});
  const {user, setUser} = useUserProvider();
  const [questions, setQuestions] = useState([] as QuestionModel[]);
  const [confirmDialogData, setConfirmDialogData] = useState(
    {} as ConfirmDialogDataModel,
  );
  const [testResultDialogData, setTestResultDialogData] = useState({
    title: 'Kết quả đã chọn',
    options: [undefined],
  } as TestResultDialogDataModel);
  const [openTestResultDialog, setOpenTestResultDialog] = useState(false);
  const data = navigation
    .getState()
    .routes.filter(item => item.name === 'ResultDetail')[0];
  // console.log(
  //   navigation.getState().routes.filter(item => item.name === 'TestDetail')[0]
  //     .params,
  // );
  const id = data?.params?.data?.id;
  useEffect(() => {
    const fetchData = async () => {
      await getInitData();
      setInitDialogData();
    };
    fetchData();
    return () => {
      if (timerIntervalRef.current) {
        console.log('clear interval', timerIntervalRef);
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);
  const getInitData = async () => {
    await getResultById(id);
  };
  const setInitDialogData = () => {
    setConfirmDialogData(InitValuesConfirmDialogData);
  };
  const getResultById = async (id: string) => {
    try {
      const response = await ResultService.getResultById(id);
      if (response.data?.code === CONFIG.API_RESPONSE_STATUS.SUCCESS) {
        setResults(response.data?.data || {});
      }
    } catch (err) {
      console.log('err when get test detail', err);
    }
  };
  const handleShowProcessDialog = () => {
    setTestResultDialogData({
      ...testResultDialogData,
      options: questions.map((item, index) => ({
        position: index + 1,
        answer: item.answer,
      })),
    });
    setOpenTestResultDialog(true);
  };
  const handleCloseProcessDialog = () => {
    setOpenTestResultDialog(false);
  };
  const getResultAnswerStyle = (item: any, answer: string) => {
    if (item.choose === answer && answer === item.correct_answer) {
      return styles.answerSelected;
    } else if (answer === item.correct_answer) {
      return styles.answerSelected;
    } else if (item.choose === answer && answer !== item.correct_answer) {
      return styles.answerWrong;
    }
    return {};
  };
  const getRadioButtonType = (item: any, answer: string) => {
    if (item.choose === answer && answer === item.correct_answer) {
      return 'highlight';
    } else if (answer === item.correct_answer) {
      return 'highlight';
    } else if (item.choose === answer && answer !== item.correct_answer) {
      return 'wrong';
    }
    return 'default';
  };
  return (
    <View style={styles.container}>
      <View style={styles.infoBar}>
        <Text>Tổng điểm: {results.mark}</Text>
      </View>

      {/* List of Questions */}
      <FlatList
        data={results.detail || []}
        keyExtractor={item => item?.id.toString()}
        renderItem={({item, index}) => (
          // Render each question here
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>
              Câu {index + 1}: {item.question}
            </Text>
            <RadioButton.Group
              onValueChange={value => (item.answer = value)}
              value={item.answer}>
              <View style={styles.flexView} key={`answer_a_${index + 1}`}>
                <ResultRadioButton
                  options={{
                    selected: item.choose === 'answer_a',
                    text: 'A',
                    type: getRadioButtonType(item, 'answer_a'),
                  }}
                  onPress={() => {}}></ResultRadioButton>
                <Text
                  style={[
                    getResultAnswerStyle(item, 'answer_a'),
                    styles.answer,
                  ]}>
                  {item.answer_a}
                </Text>
              </View>
              <View style={styles.flexView} key={`answer_b_${index + 1}`}>
                <ResultRadioButton
                  options={{
                    selected: item.choose === 'answer_b',
                    text: 'B',
                    type: getRadioButtonType(item, 'answer_b'),
                  }}
                  onPress={() => {}}></ResultRadioButton>
                <Text
                  style={[
                    getResultAnswerStyle(item, 'answer_b'),
                    styles.answer,
                  ]}>
                  {item.answer_b}
                </Text>
              </View>
              <View style={styles.flexView} key={`answer_c_${index + 1}`}>
                <ResultRadioButton
                  options={{
                    selected: item.choose === 'answer_c',
                    text: 'C',
                    type: getRadioButtonType(item, 'answer_c'),
                  }}
                  onPress={() => {}}></ResultRadioButton>
                <Text
                  style={[
                    getResultAnswerStyle(item, 'answer_c'),
                    styles.answer,
                  ]}>
                  {item.answer_c}
                </Text>
              </View>
              <View style={styles.flexView} key={`answer_d_${index + 1}`}>
                <ResultRadioButton
                  options={{
                    selected: item.choose === 'answer_d',
                    text: 'D',
                    type: getRadioButtonType(item, 'answer_d'),
                  }}
                  onPress={() => {}}></ResultRadioButton>
                <Text
                  style={[
                    getResultAnswerStyle(item, 'answer_d'),
                    styles.answer,
                  ]}>
                  {item.answer_d}
                </Text>
              </View>
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
  flexView: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    marginRight: 10,
  },
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
  questionTitle: {
    fontWeight: '700',
    fontSize: 18,
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
  answer: {
    fontSize: 16,
    display: 'flex',
    flex: 1,
  },
  answerSelected: {
    fontSize: 16,
    display: 'flex',
    flex: 1,
    color: '#1976d2',
  },
  answerWrong: {
    fontSize: 16,
    display: 'flex',
    flex: 1,
    color: '#e74c3c',
  },
});
export default ResultDetailComponent;
