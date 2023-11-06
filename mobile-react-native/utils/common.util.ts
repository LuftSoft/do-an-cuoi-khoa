export const CommonUtil = {
  getDate: (date: string) => {
    return new Date(date).toUTCString;
  },
};
