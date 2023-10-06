import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { fetchSubjectDropdowns } from 'apiCallers/subjects';
import type { FilterProps } from 'components/common/SearchArea';
import type { SubjectDropdownModel } from 'models/subject.model';
import type { CommonFilterType } from 'utils/filter.helper';
import {
  commonFilterArrayToObject,
  getAllCommonFilterDropdownOptions,
} from 'utils/filter.helper';

type UseFilters = (input: {
  objectName: string;
  commonFilterConfigs?: {
    placeHolder?: string;
    filterTypes: CommonFilterType[];
  };
}) => {
  filterProps: FilterProps[];
  additionalBaseQueryKey: any[];
  additionalOtherArgs: Record<string, any>;
};

export const useFilters: UseFilters = ({ objectName, commonFilterConfigs }) => {
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

  const { data: subjectFilters, isLoading: isLoadingSubjectFilters } = useQuery<
    SubjectDropdownModel[]
  >({
    queryKey: ['subjects', 'dropdowns'],
    queryFn: fetchSubjectDropdowns,
  });

  const ALL_COMMON_FILTER_DROPDOWN_OPTIONS =
    getAllCommonFilterDropdownOptions(objectName);

  const [selectedCommonFilters, setSelectedCommonFilters] = useState<
    CommonFilterType[]
  >([]);

  const commonFilterDropdownOptions = useMemo(() => {
    const commonFilterTypes = commonFilterConfigs?.filterTypes || [
      'showInactive',
      'showOnlyMine',
    ];

    return ALL_COMMON_FILTER_DROPDOWN_OPTIONS.filter((filter) =>
      commonFilterTypes.includes(filter.value),
    ).map((element) => ({
      value: element.value,
      label: element.label,
    }));
  }, [ALL_COMMON_FILTER_DROPDOWN_OPTIONS, commonFilterConfigs?.filterTypes]);

  const filterProps = [
    {
      placeHolder: isLoadingSubjectFilters ? 'Đang tải...' : 'Lọc theo môn học',
      allFilters:
        subjectFilters?.map((subject) => ({
          value: subject.id,
          label: subject.name,
        })) || [],
      selectedValues: selectedSubjectIds,
      setSelectedValues: setSelectedSubjectIds,
    },
    {
      placeHolder:
        commonFilterConfigs?.placeHolder || 'Lọc theo các tiêu chí khác',
      allFilters: commonFilterDropdownOptions,
      selectedValues: selectedCommonFilters,
      setSelectedValues: setSelectedCommonFilters,
    },
  ];

  return {
    filterProps,
    additionalBaseQueryKey: [...selectedSubjectIds, ...selectedCommonFilters],
    additionalOtherArgs: {
      subjectIds: selectedSubjectIds,
      ...commonFilterArrayToObject(selectedCommonFilters),
    },
  };
};
