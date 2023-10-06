import { FormControlLabel, Switch } from '@mui/material';
import type { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';

import type { Filter } from './inputs/FilterMultipleSelect';
import FilterMultipleSelect from './inputs/FilterMultipleSelect';
import SearchInput from './inputs/SearchInput';
import AddRecordButton from './table/AddRecordButton';

import FlexBox from 'components/utils-layout/flex-box/FlexBox';
import FlexRowCenter from 'components/utils-layout/flex-box/FlexRowCenter';

export type FilterProps = {
  placeHolder: string;
  allFilters: Filter[];
  selectedValues: string[];
  setSelectedValues: Dispatch<SetStateAction<string[]>>;
};

type SearchAreaProps = {
  searchProps: {
    handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
    placeHolder: string;
  };

  filterProps?: FilterProps[];

  addRecordButtonProps?: {
    text: string;
    handleBtnClick: () => void;
  };

  switchProps?: {
    label: string;
    value: boolean;
    handleSwitchToggle: Dispatch<SetStateAction<boolean>>;
  };
};

const SearchArea: FC<SearchAreaProps> = (props) => {
  const { searchProps, filterProps, switchProps, addRecordButtonProps } = props;

  return (
    <FlexBox mb={2} gap={2} justifyContent='space-between' flexWrap='wrap'>
      <FlexRowCenter flexGrow={1} gap={2} justifyContent='left'>
        <SearchInput
          sx={{ flexGrow: 1 }}
          placeholder={searchProps.placeHolder}
          onChange={searchProps.handleSearch}
        />
        {!!filterProps &&
          filterProps.map((filterProp, index) => (
            <FilterMultipleSelect
              key={index}
              sx={{ flexGrow: 1, maxWidth: 350 }}
              {...filterProp}
            />
          ))}

        {!!switchProps && (
          <FormControlLabel
            control={
              <Switch
                checked={switchProps.value}
                onChange={() =>
                  switchProps.handleSwitchToggle((state) => !state)
                }
              />
            }
            label={switchProps.label}
          />
        )}
      </FlexRowCenter>

      {!!addRecordButtonProps && (
        <AddRecordButton
          handleBtnClick={addRecordButtonProps.handleBtnClick}
          text={addRecordButtonProps.text}
        />
      )}
    </FlexBox>
  );
};

export default SearchArea;
