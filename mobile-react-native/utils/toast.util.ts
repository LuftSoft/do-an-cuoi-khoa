import Toast from "react-native-toast-message"

export const ToastUtil = {
    // 'info', 'error', 'success', or 'warning'
    success: (textOne: string, textTwo: string) => {
        Toast.show({
            type: 'success',
            position: 'top',
            text1: textOne,
            text2: textTwo,
        });
    },
    error: (textOne: string, textTwo: string) => {
        Toast.show({
            type: 'error',
            position: 'top',
            text1: textOne,
            text2: textTwo,
        });
    },
    info: (textOne: string, textTwo: string) => {
        Toast.show({
            type: 'info',
            position: 'top',
            text1: textOne,
            text2: textTwo,
        });
    },
    warning: (textOne: string, textTwo: string) => {
        Toast.show({
            type: 'warning',
            position: 'top',
            text1: textOne,
            text2: textTwo,
        });
    },
}