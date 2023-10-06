export const shortenString = (input = '', maxLength = 100): string => {
  if (input.length <= maxLength) {
    return input;
  }
  return `${input.substring(0, maxLength - 3)}...`;
};

export const capitalizeFirstChar = (str: string) => {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const serialize = (data: any) => {
  return JSON.parse(JSON.stringify(data));
};

export const getPlainTextFromHTML = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

export const trimFormikValues = (values: any): any => {
  if (typeof values === 'string') {
    return values.trim();
  }

  if (Array.isArray(values)) {
    return values.map(trimFormikValues);
  }

  if (typeof values === 'object' && values !== null) {
    const trimmedObj: any = {};
    for (const key in values) {
      if (Object.hasOwn(values, key)) {
        trimmedObj[key] = trimFormikValues(values[key]);
      }
    }
    return trimmedObj;
  }

  return values;
};
