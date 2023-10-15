// import getConfig from "next/config";
import { differenceInMinutes } from 'date-fns';
import ceil from 'lodash/ceil';

/**
 * GET THE DIFFERENCE DATE FORMAT
 * @param  date - which is created comment data
 * @returns string - formatted from now
 */

export function getDateDifferenceFromNow(date: string | number | Date) {
  let diff = differenceInMinutes(new Date(), new Date(date));
  if (diff < 60) return diff + ' minutes ago';

  diff = ceil(diff / 60);
  if (diff < 24) return `${diff} hour${diff === 0 ? '' : 's'} ago`;

  diff = ceil(diff / 24);
  if (diff < 30) return `${diff} day${diff === 0 ? '' : 's'} ago`;

  diff = ceil(diff / 30);
  if (diff < 12) return `${diff} month${diff === 0 ? '' : 's'} ago`;

  diff = diff / 12;
  return `${diff.toFixed(1)} year${ceil(diff) === 0 ? '' : 's'} ago`;
}