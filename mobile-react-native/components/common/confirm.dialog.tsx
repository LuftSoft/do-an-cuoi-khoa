import {Button, Dialog, Portal, Text} from 'react-native-paper';

export const ConfirmDialogComponent = (props: any) => {
  const {open, hideDialog, data} = props;
  return (
    <Portal>
      <Dialog visible={open} onDismiss={hideDialog}>
        <Dialog.Title>
          <Text variant="headlineMedium">{data.title}</Text>
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{data.content}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => hideDialog(true)}>
            {data.yesOption || 'Đồng ý'}
          </Button>
          <Button onPress={() => hideDialog(false)}>
            {data.noOption || 'Hủy'}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
