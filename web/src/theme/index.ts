import { createTheme, type MantineColorsTuple } from '@mantine/core';

const brand: MantineColorsTuple = [
  '#f2efff',
  '#e0daff',
  '#bfb1ff',
  '#9c86ff',
  '#7e61ff',
  '#6d4cff',
  '#6640ff',
  '#5532e3',
  '#4a2ccb',
  '#3e23b3',
];

export const theme = createTheme({
  primaryColor: 'brand',
  colors: { brand },
  fontFamily:
    'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  headings: { fontWeight: '600' },
  defaultRadius: 'md',
  cursorType: 'pointer',
});
