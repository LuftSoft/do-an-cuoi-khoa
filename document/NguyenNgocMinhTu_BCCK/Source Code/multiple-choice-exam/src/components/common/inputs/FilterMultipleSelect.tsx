import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
// import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import { Tooltip } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { useMemo, type Dispatch, type SetStateAction } from 'react';

import { StyledInputBase } from './SearchInput';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(
  value: string,
  selectedValues: readonly string[],
  theme: Theme,
) {
  return {
    fontWeight:
      selectedValues.indexOf(value) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export type Filter = {
  value: string;
  label: string;
};

type FilterMultipleSelectProps = {
  sx: SxProps<Theme>;
  placeHolder: string;
  allFilters: Filter[];
  selectedValues: string[];
  setSelectedValues: Dispatch<SetStateAction<string[]>>;
};

const FilterMultipleSelect: React.FC<FilterMultipleSelectProps> = ({
  sx,
  placeHolder,
  allFilters,
  selectedValues,
  setSelectedValues,
}) => {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedValues(typeof value === 'string' ? value.split(',') : value);
  };

  const selectedLabels = useMemo(
    () =>
      selectedValues.map(
        (value) => allFilters.find((filter) => filter.value === value)?.label,
      ),
    [selectedValues, allFilters],
  );

  const haveTooltip = selectedLabels.length > 0;

  return (
    <Tooltip
      PopperProps={{
        sx: {
          display: haveTooltip ? 'block' : 'none',
        },
      }}
      title={
        <ol
          style={{
            paddingInlineStart: '16px',
            display: haveTooltip ? 'block' : 'none',
          }}
        >
          {selectedLabels.map((label, index) => (
            <li key={index}>{label}</li>
          ))}
        </ol>
      }
      placement='right'
    >
      <FormControl sx={sx} disabled={allFilters.length === 0}>
        <Select
          multiple
          displayEmpty
          value={selectedValues}
          onChange={handleChange}
          input={
            <StyledInputBase
              startAdornment={
                <FilterAltOutlinedIcon sx={{ fontSize: 19, mr: 0.5 }} />
              }
            />
          }
          renderValue={(selectedValues) => {
            if (selectedValues.length === 0) {
              return <span style={{ opacity: 0.42 }}>{placeHolder}</span>;
            }
            return selectedLabels.join(', ');
          }}
          MenuProps={MenuProps}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {allFilters.map((filter) => (
            <MenuItem
              key={filter.value}
              value={filter.value}
              style={getStyles(filter.value, selectedValues, theme)}
            >
              {filter.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Tooltip>
  );
};

export default FilterMultipleSelect;
