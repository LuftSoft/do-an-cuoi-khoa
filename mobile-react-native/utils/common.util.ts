export const CommonUtil = {
  getDate: (date: string) => {
    return new Date(date).toUTCString;
  },
};
export const Helpers = {
  cloneDeep: (data: any) => {
    return JSON.parse(JSON.stringify(data));
  }
}