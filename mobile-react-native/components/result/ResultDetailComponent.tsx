import {StackNavigationProp} from '@react-navigation/stack';
import {useEffect, useRef, useState} from 'react';
import {
  BackHandler,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import {useIsFocused} from '@react-navigation/native';

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
    } else if (answer === item.correct_answer && item.choose.length > 0) {
      return styles.answerSelected;
    } else if (answer === item.correct_answer && item.choose.length == 0) {
      return styles.answerWrong;
    } else if (item.choose === answer && answer !== item.correct_answer) {
      return styles.answerWrong;
    }
    return {};
  };
  const getRadioButtonType = (item: any, answer: string) => {
    if (item.choose === answer && answer === item.correct_answer) {
      return 'highlight';
    } else if (answer === item.correct_answer && item.choose.length > 0) {
      return 'highlight';
    } else if (answer === item.correct_answer && item.choose.length == 0) {
      return 'wrong';
    } else if (item.choose === answer && answer !== item.correct_answer) {
      return 'wrong';
    }
    return 'default';
  };
  return (
    <View style={styles.container}>
      <View style={styles.infoBar}>
        <Text style={{color: '#fff', fontSize: 15}}>
          Tổng điểm:{' '}
          <Text style={{fontWeight: 'bold'}}>
            {results.mark}/{results.total_mark}
          </Text>
        </Text>
      </View>

      {/* List of Questions */}
      <FlatList
        data={results.detail || []}
        keyExtractor={item => item?.id.toString()}
        renderItem={({item, index}) => (
          // Render each question here
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>
              <Text style={{fontWeight: '700'}}>Câu {index + 1}</Text>:{' '}
              {item.question}
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
    </View>
  );
};
const styles = StyleSheet.create({
  flexView: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#171717',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(179, 209, 255, 0.8)',
  },
  infoBar: {
    padding: 12,
    backgroundColor: '#1976d2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  questionTitle: {
    color: '#000',
    fontWeight: '600',
    fontSize: 18,
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
    borderRadius: 20,
    shadowColor: '#171717',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
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
