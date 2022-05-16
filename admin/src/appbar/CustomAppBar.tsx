import {
  AppBar,
  AppBarProps,
  defaultTheme,
  LocalesMenuButton,
  ToggleThemeButton,
} from 'react-admin';
import { Box, createTheme, Typography } from '@mui/material';

export const CustomAppBar = (props: AppBarProps) => {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <AppBar {...props}>
      <Box flex="1">
        <Typography flex="1" variant="h6" id="react-admin-title" />
      </Box>
      <LocalesMenuButton
        languages={[
          { locale: 'en', name: 'English' },
          { locale: 'nl', name: 'Nederlands' },
        ]}
      />
      <ToggleThemeButton lightTheme={defaultTheme} darkTheme={darkTheme} />
    </AppBar>
  );
};
