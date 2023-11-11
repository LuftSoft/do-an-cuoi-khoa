export interface ConfirmDialogDataModel {
    title: string,
    content: string,
    yesOption: string,
    noOption: string
}
export const InitValuesConfirmDialogData: ConfirmDialogDataModel = {
    content: '',
    title: '',
    yesOption: 'Đồng ý',
    noOption: 'Hủy'
} 