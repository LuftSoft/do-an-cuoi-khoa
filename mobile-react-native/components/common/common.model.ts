export interface ConfirmDialogDataModel {
    title: string,
    content: string,
    yesOption: string,
    noOption: string,
    fullTimeSubmit: number,
}
export const InitValuesConfirmDialogData: ConfirmDialogDataModel = {
    content: '',
    title: '',
    yesOption: 'Đồng ý',
    noOption: 'Hủy',
    fullTimeSubmit: 0,
}
export interface TestResultDialogDataModel {
    title: string,
    options: any[]
}

export interface TestResultProcessModel {

}