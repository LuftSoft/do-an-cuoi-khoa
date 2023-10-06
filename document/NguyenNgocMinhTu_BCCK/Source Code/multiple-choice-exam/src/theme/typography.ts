export const fontSize = 14;

import { Rubik } from 'next/font/google';

// fallback font
export const rubik = Rubik({
  subsets: ['latin'],
});

export const typography = {
  fontSize,
  fontFamily: `SVN-Rubik, ${rubik.style.fontFamily}`,
  htmlFontSize: 16,
  body1: { fontSize },
  body2: { fontSize },
};
