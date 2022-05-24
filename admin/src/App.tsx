import {
  Admin,
  Layout,
  CustomRoutes,
  LayoutProps,
  Resource,
  Title,
} from 'react-admin';
import { createBrowserHistory } from 'history';
import { Route } from 'react-router-dom';
import { CardList } from './lists/CardList';
import { TagList } from './lists/TagList';
import { SetList } from './lists/SetList';
import { CardCreate } from './create/CardCreate';
import { TagCreate } from './create/TagCreate';
import { CardEdit } from './edit/CardEdit';
import CustomDataProvider from './dataprovider/DataProvider';
import { SetEdit } from './edit/SetEdit';
import { SetCreate } from './create/SetCreate';
import { CustomAppBar } from './appbar/CustomAppBar';
import englishMessages from 'ra-language-english';
import dutchMessages from 'ra-language-dutch';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { CardUpload } from './create/CardUpload';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, Typography } from '@mui/material';

const dataProvider = CustomDataProvider('http://localhost:3003/api');
const layout = (props: LayoutProps) => (
  <Layout {...props} appBar={CustomAppBar} />
);
const i18nProvider = polyglotI18nProvider(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  (locale) => (locale === 'nl' ? dutchMessages : englishMessages),
  'en',
);
const dashboard = () => (
  <Card>
    <Title title="Admin dashboard" />
    <CardContent>
      <Typography variant="h5" component="div" gutterBottom>
        Admin dashboard
      </Typography>
      <Button
        variant="contained"
        onClick={() => (window.location.href = '/admin/import')}
      >
        Import cards
      </Button>
    </CardContent>
  </Card>
);

const App = (): JSX.Element => (
  <Admin
    dataProvider={dataProvider}
    i18nProvider={i18nProvider}
    layout={layout}
    dashboard={dashboard}
  >
    <Resource
      name="cards"
      list={CardList}
      edit={CardEdit}
      create={CardCreate}
    />
    <Resource name="tags" list={TagList} create={TagCreate} />
    <Resource name="sets" list={SetList} edit={SetEdit} create={SetCreate} />
    <CustomRoutes>
      <Route path="/import" element={<CardUpload />} />
    </CustomRoutes>
  </Admin>
);

export default App;
