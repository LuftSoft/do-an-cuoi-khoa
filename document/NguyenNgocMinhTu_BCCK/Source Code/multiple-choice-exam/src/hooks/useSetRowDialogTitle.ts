import { useEffect, useState } from 'react';

import type { DialogActionMode } from 'types/common';

export const useSetRowDialogTitle = (
  mode: DialogActionMode,
  suffix: string,
) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    switch (mode) {
      case 'add':
        setTitle(`Thêm ${suffix}`);
        break;
      case 'edit':
        setTitle(`Sửa ${suffix}`);
        break;
      case 'view':
        setTitle(`Xem ${suffix}`);
        break;
    }
  }, [mode, suffix]);

  return title;
};
