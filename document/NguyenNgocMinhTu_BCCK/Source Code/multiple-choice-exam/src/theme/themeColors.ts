// =================================================================
interface CustomPaletteColor {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  600: string;
  700: string;
  800: string;
  900: string;
  main: string;
  contrastText: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    dark: CustomPaletteColor;
    paste: CustomPaletteColor;
    marron: CustomPaletteColor;
  }

  interface PaletteOptions {
    dark: CustomPaletteColor;
    paste: CustomPaletteColor;
    marron: CustomPaletteColor;
  }
}
// =================================================================

export const grey = {
  900: '#2B3445', // Main Text
  800: '#373F50', // Paragraph
  700: '#4B566B',
  600: '#7D879C', // Low Priority form Title/Text
  500: '#AEB4BE', //
  400: '#DAE1E7', // Border
  300: '#E3E9EF',
  200: '#F3F5F9', // Line Stroke
  100: '#F6F9FC',
  // copies of the comments above, just for convenience
  mainText: '#2B3445',
  paragraph: '#373F50',
  lowPriority: '#7D879C',
  border: '#DAE1E7',
  lineStroke: '#F3F5F9',
  disabled: '#7D879C',
};

export const primary = {
  50: '#e2f6ff',
  100: '#b4e7ff',
  200: '#82d8ff',
  300: '#4ec8ff',
  400: '#25bcff',
  500: '#00afff',
  600: '#00a1f2',
  700: '#038ede',
  800: '#037dca',
  900: '#065ca8',
  main: '#038ede',
};

export const secondary = {
  50: '#fef3e0',
  100: '#fcdfb2',
  200: '#fbcb81',
  300: '#f9b64f',
  400: '#f9a62a',
  500: '#f8970a',
  600: '#f48c08',
  700: '#ee7c06',
  800: '#e76d04',
  900: '#de5303',
  main: '#de5303',
};

export const error = {
  100: '#FFEAEA',
  200: '#FFCBCB',
  300: '#FFA9A9',
  400: '#FF6D6D',
  500: '#FF5353',
  600: '#FF4C4C',
  700: '#FF4242',
  800: '#FF3939',
  900: '#FF2929',
  main: '#E94560',
};

export const success = {
  100: '#E7F9ED',
  200: '#C2F1D1',
  300: '#99E8B3',
  400: '#52D77E',
  500: '#33D067',
  600: '#2ECB5F',
  700: '#27C454',
  800: '#20BE4A',
  900: '#0b7724',
  main: 'rgb(51, 208, 103)',
};

// export const blue = {
//   50: '#f3f5f9',
//   100: '#DBF0FE',
//   200: '#B8DEFE',
//   300: '#94C9FE',
//   400: '#7AB6FD',
//   500: '#4E97FD',
//   600: '#3975D9',
//   700: '#2756B6',
//   800: '#183C92',
//   900: '#0E2979',
//   main: '#4E97FD',
//   contrastText: '#FFFFFF',
// };

export const marron = {
  50: '#f3f5f9',
  100: '#F6F2ED',
  200: '#F8DBD1',
  300: '#EBBCB3',
  400: '#D89C98',
  600: '#A3545C',
  700: '#883948',
  800: '#6E2438',
  900: '#5B162F',
  main: '#BE7374',
};

export const paste = {
  50: '#F5F5F5',
  100: '#DDFBF1',
  200: '#BDF7E8',
  300: '#97E8DA',
  400: '#76D2CA',
  600: '#36929A',
  700: '#257181',
  800: '#175368',
  900: '#0E3D56',
  main: '#4BB4B4',
  contrastText: '#FFFFFF',
};

export const warning = {
  100: '#FFF8E5',
  main: '#feae01',
  contrastText: '#FFFFFF',
};

export const dark = { main: '#222' };
export const white = { main: '#fff' };

export const themeColors = {
  dark,
  grey,
  paste,
  error,
  marron,
  warning,
  success,
  secondary,
  info: primary,
  divider: grey['lineStroke'],
  background: { default: grey[100] },
  text: {
    primary: grey['mainText'],
    secondary: grey['paragraph'],
    disabled: grey[500],
  },
};
