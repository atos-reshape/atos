import { LocalesMenuButton, AppBar, AppBarProps } from 'react-admin';
import { Typography } from '@mui/material';

export const CustomAppBar = (props: AppBarProps) => (
  <AppBar {...props}>
    <Typography flex="1" variant="h6" id="react-admin-title"></Typography>
    <LocalesMenuButton
      languages={[
        { locale: 'en', name: 'English' },
        { locale: 'nl', name: 'Nederlands' },
      ]}
    />
  </AppBar>
);
