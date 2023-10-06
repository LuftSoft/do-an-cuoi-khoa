import { CssBaseline } from '@mui/material';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles';
import merge from 'lodash/merge';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';

import customThemeOptions from './themeOptions';

// =======================================================
type MuiThemeProps = { children?: ReactNode };
// =======================================================

const MuiTheme: FC<MuiThemeProps> = ({ children }) => {
  const { pathname } = useRouter();
  const { publicRuntimeConfig } = getConfig(); // Value is coming from next.config.js

  const themeOptions = customThemeOptions(publicRuntimeConfig, pathname);
  let theme = createTheme(merge({}, { ...themeOptions }));
  theme = responsiveFontSizes(theme);

  // TailwindCSS: md lg xl 2xl
  theme.shadows[1] =
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
  theme.shadows[2] =
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)';
  theme.shadows[3] =
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
  theme.shadows[4] = '0 25px 50px -12px rgb(0 0 0 / 0.25)';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MuiTheme;
