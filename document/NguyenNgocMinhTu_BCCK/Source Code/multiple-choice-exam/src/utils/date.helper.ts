import {
  addDays,
  endOfYesterday,
  format,
  isAfter,
  isBefore,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
  isEqual,
  setMilliseconds,
  isPast,
  addMinutes,
  isWithinInterval,
} from 'date-fns';

const getFinalDate = (date: Date | string): Date =>
  typeof date === 'string' ? new Date(date) : date;

export const formatDateForDisplay = (date: Date | string): string => {
  const finalDate = getFinalDate(date);
  return format(finalDate, 'dd/MM/yyyy | hh:mm:ss a');
};

export const getNewTime = (oldDate: Date, newDate: Date): Date => {
  const finalOldDate = getFinalDate(oldDate);
  const finalNewDate = getFinalDate(newDate);

  const resultDate = new Date(finalOldDate.getTime());

  resultDate.setHours(finalNewDate.getHours());
  resultDate.setMinutes(finalNewDate.getMinutes());
  resultDate.setSeconds(finalNewDate.getSeconds());
  resultDate.setMilliseconds(finalNewDate.getMilliseconds());

  return resultDate;
};

export const getNewDate = (oldDate: Date, newDate: Date): Date => {
  const finalOldDate = getFinalDate(oldDate);
  const finalNewDate = getFinalDate(newDate);

  const resultDate = new Date(finalOldDate.getTime());

  resultDate.setFullYear(finalNewDate.getFullYear());
  resultDate.setMonth(finalNewDate.getMonth());
  resultDate.setDate(finalNewDate.getDate());

  return resultDate;
};

export const isAfterToday = (inputDate: Date | string) => {
  const finalDate = getFinalDate(inputDate);
  const tomorrow = startOfDay(addDays(new Date(), 1));

  return isEqual(finalDate, tomorrow) || isAfter(finalDate, tomorrow);
};

export const isAfterNineAMTomorrow = (inputDate: Date | string): boolean => {
  let finalDate = getFinalDate(inputDate);

  const now = new Date();

  // Define 9AM tomorrow
  let nineAMTomorrow = setHours(addDays(now, 1), 9);
  nineAMTomorrow = setMinutes(nineAMTomorrow, 0);
  nineAMTomorrow = setSeconds(nineAMTomorrow, 0);
  nineAMTomorrow = setMilliseconds(nineAMTomorrow, 0);

  finalDate = setSeconds(finalDate, 0);
  finalDate = setMilliseconds(finalDate, 0);

  return (
    isEqual(finalDate, nineAMTomorrow) || isAfter(finalDate, nineAMTomorrow)
  );
};

export const isYesterdayOrEarlier = (inputDate: Date | string): boolean => {
  const finalDate = getFinalDate(inputDate);

  const yesterday = endOfYesterday();

  return isBefore(finalDate, yesterday);
};

export const checkIsTestPast = (
  testDateStart: Date | string,
  durationInMinutes: number,
): boolean => {
  const finalTestDateStart = getFinalDate(testDateStart);

  const testDateEnd = addMinutes(finalTestDateStart, durationInMinutes);

  return isPast(testDateEnd);
};

export const checkIsTestHappening = (
  testDateStart: Date | string,
  durationInMinutes: number,
): boolean => {
  const finalTestDate = getFinalDate(testDateStart);

  const testDateEnd = addMinutes(finalTestDate, durationInMinutes);

  return isWithinInterval(new Date(), {
    start: finalTestDate,
    end: testDateEnd,
  });
};
