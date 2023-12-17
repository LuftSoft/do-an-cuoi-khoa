import {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {
  Button,
  Dialog,
  Icon,
  MD3Colors,
  Portal,
  Text,
} from 'react-native-paper';

export const TestResultDialogComponent = (props: any) => {
  const {open, hideDialog, data, handleScrollIndex} = props;
  useEffect(() => {
    console.log(data);
  }, [data]);
  const handleClick = (index: number) => {
    handleScrollIndex(index);
  };
  return (
    <Portal>
      <Dialog visible={open} onDismiss={hideDialog}>
        <Dialog.Title>
          <Text variant="headlineMedium">{data?.title}</Text>
        </Dialog.Title>
        <Dialog.Content style={styles.content_container}>
          {data.options.map((item: any) => (
            <Text
              onPress={() => handleClick(item?.position - 1)}
              variant="bodyMedium"
              style={[
                styles.content_item,
                item?.answer
                  ? styles.content_item__selected
                  : styles.content_item__unselect,
              ]}>
              {item?.position}
            </Text>
          ))}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => hideDialog(false)}>
            {/* <Icon source="camera" color={MD3Colors.error50} size={20} /> */}
            Đóng
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
const styles = StyleSheet.create({
  content_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  content_item: {
    width: '19%',
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 5,
    textAlign: 'center',
    alignItems: 'center',
    marginBottom: 5,
    fontSize: 16,
  },
  content_item__unselect: {
    backgroundColor: '#fff',
    color: '#1976d2',
    borderColor: '#1976d2',
    borderWidth: 1,
  },
  content_item__selected: {
    backgroundColor: '#1976d2',
    color: '#fff',
  },
});
