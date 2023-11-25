import dayjs from "dayjs";

export const CommonUtil = {
  getDate: (date: string) => {
    return new Date(date).toUTCString;
  },
};
export const Helpers = {
  cloneDeep: (data: any) => {
    return JSON.parse(JSON.stringify(data));
  },
  convertToDate: (date: any) => {
    return dayjs(date).format('YYYY-MM-DD');
  },
  convertToDateTime: (date: any) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  }
}