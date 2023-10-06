export type CommonFilterType = 'showOnlyMine' | 'showInactive';
export type CommonFilterDropdownOption = {
  label: string;
  value: CommonFilterType;
};

export const commonFilterArrayToObject = (
  arr: string[],
): Record<CommonFilterType, true> => {
  const obj: { [key: string]: boolean } = {};
  for (let i = 0; i < arr.length; i++) {
    obj[arr[i]] = true;
  }
  return obj as Record<string, true>;
};

export const getAllCommonFilterDropdownOptions = (
  objectName: string,
): CommonFilterDropdownOption[] => [
  {
    label: `Chỉ hiện các ${objectName} của tôi`,
    value: 'showOnlyMine',
  },
  {
    label: `Hiện các ${objectName} bị vô hiệu hoá`,
    value: 'showInactive',
  },
];
