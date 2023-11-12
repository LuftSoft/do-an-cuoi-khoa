import {useEffect} from 'react';
import {Button, Dialog, Portal, Text} from 'react-native-paper';

export const ConfirmDialogComponent = (props: any) => {
  const {open, hideDialog, data} = props;
  var isChange = false;
  useEffect(() => {
    if (!isChange && data.fullTimeSubmit > 0 && data.fullTimeSubmit) {
      isChange = !isChange;
      console.log('hide dialog confirm');
      setTimeout(() => {
        hideDialog(true);
      }, data.fullTimeSubmit * 1000);
    }
  }, [data.fullTimeSubmit]);
  return (
    <Portal>
      <Dialog visible={open} onDismiss={hideDialog}>
        <Dialog.Title>
          <Text variant="headlineMedium">{data.title}</Text>
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{data.content}</Text>
        </Dialog.Content>
        {data.fullTimeSubmit === 0 ? (
          <Dialog.Actions>
            <Button onPress={() => hideDialog(true)}>
              {data.yesOption || 'Đồng ý'}
            </Button>
            <Button onPress={() => hideDialog(false)}>
              {data.noOption || 'Hủy'}
            </Button>
          </Dialog.Actions>
        ) : null}
      </Dialog>
    </Portal>
  );
};
