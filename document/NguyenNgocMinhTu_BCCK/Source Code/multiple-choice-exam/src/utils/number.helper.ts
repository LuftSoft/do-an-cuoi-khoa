export const isNaNOrEmptyString = (input: string) =>
  isNaN(Number(input)) || input === '';
