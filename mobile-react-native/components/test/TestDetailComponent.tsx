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
import CustomRadioButton from '../common/radio.button';
import {RootStackParamList} from '../overview/OverviewComponent';
import {QuestionModel, QuestionResultModel, TestModel} from './TestModel';
import {TestService} from './TestService';
import Toast from 'react-native-toast-message';
import {ToastUtil} from '../../utils/toast.util';
import {ConfirmDialogComponent} from '../common/confirm.dialog';
import {
  ConfirmDialogDataModel,
  InitValuesConfirmDialogData,
  TestResultDialogDataModel,
} from '../common/common.model';
import {useUserProvider} from '../../utils/user.context';
import {TestResultDialogComponent} from './TestResultDialogComponent';
import {Helpers} from '../../utils/common.util';

type OverViewNavigationProp = StackNavigationProp<RootStackParamList, 'Test'>;
type Props = {
  navigation: OverViewNavigationProp;
};
const TestDetailComponent: React.FC<Props> = ({navigation}) => {
  const [test, setTest] = useState({
    questions: [] as QuestionModel[],
  } as TestModel);
  const count = useRef(0);
  const timerIntervalRef = useRef<any>({interval: null, initTime: 0});
  const {user, setUser} = useUserProvider();
  const isSubmit = useRef(false);
  const [timer, setTimer] = useState(Number.MAX_VALUE);
  const [questions, setQuestions] = useState([] as QuestionModel[]);
  const [questionResults, setQuestionResults] = useState(
    [] as QuestionResultModel[],
  );
  const [answers, setAnswers] = useState([]);
  const [confirmDialogData, setConfirmDialogData] = useState(
    {} as ConfirmDialogDataModel,
  );
  const [testResultDialogData, setTestResultDialogData] = useState({
    title: 'Kết quả đã chọn',
    options: [undefined],
  } as TestResultDialogDataModel);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openTestResultDialog, setOpenTestResultDialog] = useState(false);
  const flatListRef = useRef<FlatList<any>>(null);
  const data = navigation
    .getState()
    .routes.filter(item => item.name === 'TestDetail')[0];
  // console.log(
  //   navigation.getState().routes.filter(item => item.name === 'TestDetail')[0]
  //     .params,
  // );
  const id = data?.params?.data?.id;
  const test_credit_class_id = data?.params?.data?.test_credit_class_id;
  const test_schedule_date = data?.params?.data?.test_schedule_date;
  useEffect(() => {
    const fetchData = async () => {
      await getInitData();
      setInitDialogData();
      countDown();
    };
    fetchData();
    return () => {
      if (timerIntervalRef.current) {
        console.log('clear interval', timerIntervalRef);
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      if (!isSubmit.current) {
        e.preventDefault();
        handleSubmit();
      }
    });
  }, [navigation]);

  const getInitData = async () => {
    await getTestByUserid(id);
  };
  const setInitDialogData = () => {
    setConfirmDialogData(InitValuesConfirmDialogData);
  };
  const getTestByUserid = async (id: string) => {
    try {
      const response = await TestService.getTestDetail(id);
      if (response.data?.code === CONFIG.API_RESPONSE_STATUS.SUCCESS) {
        var testResponse = response.data?.data as TestModel;
        setTest(testResponse);
        setQuestions(testResponse.questions);
        // setQuestionResults(
        //   testResponse.questions.map(item => ({
        //     id: item.id,
        //     answer: item.answer,
        //     correct_answer: item.correct_answer,
        //   })),
        // );
        if (Number.parseInt(testResponse.time) > 0) {
          const testTime = Number.parseInt(testResponse.time) * 60;
          const join_time = Math.floor(new Date().getTime() / 1000);
          const begin_time = Math.floor(
            new Date(test_schedule_date).getTime() / 1000,
          );
          console.log('join_time', join_time);
          console.log('begin_time', begin_time);
          count.current = testTime;
          setTimer(testTime - (join_time - begin_time));
        }
      }
    } catch (err) {
      console.log('err when get test detail', err);
    }
  };
  const countDown = () => {
    timerIntervalRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer == 0) {
          clearInterval(timerIntervalRef.current);
          handleSubmit(CONFIG.TEST.SUBMIT_TYPE.FULL_TIME);
        }
        return prevTimer - 1;
      });
    }, 1000);
  };
  const getTime = (time: number) => {
    if (time < 0) return '00: 00';
    const hour = Math.floor(time / 3600);
    const second = time % 60;
    const minute = Math.floor((time - hour * 3600) / 60);
    if (hour > 0) {
      return `${hour}: ${minute >= 10 ? minute : `0${minute}`}: ${
        second >= 10 ? second : `0${second}`
      }`;
    } else {
      return `${minute}: ${second >= 10 ? second : `0${second}`}`;
    }
  };
  const handleValueChange = (item: any, value: string) => {
    setQuestions(
      questions.map(item => {
        if (item.id.toString() === id) {
          item.answer = value;
        }
        return item;
      }),
    );
    item.answer = value;
    console.log(value);
  };
  const submitTest = async () => {
    const data: any = Helpers.cloneDeep(test);
    data.test_credit_class_id = test_credit_class_id;
    data.test_schedule_date = test_schedule_date;
    data.questions = Helpers.cloneDeep(
      questions.map((q, index) => ({
        question_id: q.id,
        choose: q.answer,
        position: index + 1,
        correct_answer: q.correct_answer,
      })),
    );
    console.log('questions trong submit test bang', questions);
    const response = await TestService.submit(data, user?.accessToken || '');
    if (response.data?.code === CONFIG.API_RESPONSE_STATUS.SUCCESS) {
      ToastUtil.success('Thông báo', 'Nộp bài thành công!');
      setTimeout(() => {
        navigation.navigate('Test');
      }, 1000);
    }
  };
  const handleSubmit = async (type = CONFIG.TEST.SUBMIT_TYPE.QUIT) => {
    switch (type) {
      case CONFIG.TEST.SUBMIT_TYPE.QUIT:
        setConfirmDialogData({
          ...confirmDialogData,
          content: `Hệ thống sẽ tự động nộp bài nếu bạn 
          thoát ngay lúc này!`,
          title: `Lưu ý`,
          fullTimeSubmit: 0,
        });
        setOpenConfirmDialog(true);
        break;
      case CONFIG.TEST.SUBMIT_TYPE.SUBMIT:
        const count = questions.filter(q => q.answer != undefined).length;
        console.log('so cau hoi', count);
        var message = 'Xác nhận nộp bài?';
        if (count < questions.length) {
          message = `Bạn đang làm được ${count}/${questions.length} câu hỏi. Bạn có muốn nộp bài ngay lúc này?`;
        }
        setConfirmDialogData({
          ...confirmDialogData,
          title: 'Xác nhận',
          content: message,
          fullTimeSubmit: 0,
        });
        setOpenConfirmDialog(true);
        break;
      case CONFIG.TEST.SUBMIT_TYPE.FULL_TIME:
        setConfirmDialogData({
          ...confirmDialogData,
          title: 'Thông báo',
          content:
            'Thời gian làm bài đã kết thúc, hệ thống sẽ tự động nộp bài sau 5s',
          //set thoi gian tu dong nop bai
          fullTimeSubmit: 5,
        });
        setOpenConfirmDialog(true);
        break;
      default:
        break;
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
  const handleCloseConfirmDialog = async (e: boolean) => {
    if (e) {
      await submitTest();
      isSubmit.current = true;
    } else {
      console.log('false');
    }
    setOpenConfirmDialog(false);
  };
  const scrollToQuestion = (index: number) => {
    console.log('index', index);
    setOpenTestResultDialog(false);
    flatListRef.current?.scrollToIndex({animated: true, index: index});
  };
  return (
    <View style={styles.container}>
      {/* Information Bar */}
      <View style={styles.infoBar}>
        {/* Time Count */}
        <Text style={{color: '#fff', fontSize: 16}}>
          Còn lại: {getTime(timer)}
        </Text>
        <Button
          title="Xem bài làm"
          onPress={handleShowProcessDialog}
          color="#0066ff"></Button>
        <Button
          title="Nộp bài"
          onPress={() => handleSubmit(CONFIG.TEST.SUBMIT_TYPE.SUBMIT)}
          color="#0066ff"></Button>
        {/* Other info */}
      </View>

      {/* List of Questions */}
      <FlatList
        ref={flatListRef}
        data={questions || []}
        initialScrollIndex={0}
        keyExtractor={item => item?.id.toString()}
        renderItem={({item, index}) => (
          // Render each question here
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>
              <Text style={{fontWeight: '700'}}>Câu {index + 1}</Text>:{' '}
              {item.question}
            </Text>
            <RadioButton.Group
              key={`radio_group_${index + 1}`}
              onValueChange={value => (item.answer = value)}
              value={item.answer}>
              <View style={styles.flexView} key={`answer_a_${index + 1}`}>
                <CustomRadioButton
                  options={{selected: item.answer === 'answer_a', text: 'A'}}
                  onPress={() =>
                    handleValueChange(item, 'answer_a')
                  }></CustomRadioButton>
                <Text
                  style={[
                    item.answer === 'answer_a' ? styles.answerSelected : null,
                    styles.answer,
                  ]}>
                  {item.answer_a}
                </Text>
              </View>
              <View style={styles.flexView} key={`answer_b_${index + 1}`}>
                <CustomRadioButton
                  options={{selected: item.answer === 'answer_b', text: 'B'}}
                  onPress={() => {
                    handleValueChange(item, 'answer_b');
                  }}></CustomRadioButton>
                <Text
                  style={[
                    item.answer === 'answer_b' ? styles.answerSelected : null,
                    styles.answer,
                  ]}>
                  {item.answer_b}
                </Text>
              </View>
              <View style={styles.flexView} key={`answer_c_${index + 1}`}>
                <CustomRadioButton
                  options={{selected: item.answer === 'answer_c', text: 'C'}}
                  onPress={() => {
                    handleValueChange(item, 'answer_c');
                  }}></CustomRadioButton>
                <Text
                  style={[
                    item.answer === 'answer_c' ? styles.answerSelected : null,
                    styles.answer,
                  ]}>
                  {item.answer_c}
                </Text>
              </View>
              <View style={styles.flexView} key={`answer_d_${index + 1}`}>
                <CustomRadioButton
                  options={{selected: item.answer === 'answer_d', text: 'D'}}
                  onPress={() => {
                    handleValueChange(item, 'answer_d');
                  }}></CustomRadioButton>
                <Text
                  style={[
                    item.answer === 'answer_d' ? styles.answerSelected : null,
                    styles.answer,
                  ]}>
                  {item.answer_d}
                </Text>
              </View>
            </RadioButton.Group>
          </View>
        )}
      />
      <ConfirmDialogComponent
        open={openConfirmDialog}
        data={confirmDialogData}
        hideDialog={handleCloseConfirmDialog}></ConfirmDialogComponent>
      <TestResultDialogComponent
        open={openTestResultDialog}
        data={testResultDialogData}
        handleScrollIndex={scrollToQuestion}
        hideDialog={handleCloseProcessDialog}></TestResultDialogComponent>
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
});
export default TestDetailComponent;
