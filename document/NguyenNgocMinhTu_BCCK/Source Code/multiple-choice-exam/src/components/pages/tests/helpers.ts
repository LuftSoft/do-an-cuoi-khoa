import { addHours, isAfter } from 'date-fns';

export function getIsTestDateValidToEdit(
  date: Date | string | undefined,
): boolean {
  if (!date) return false;
  const finalDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const oneHourLater = addHours(now, 1);
  return isAfter(finalDate, oneHourLater);
}
