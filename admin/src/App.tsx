import React from 'react';
import {
  Admin,
  Layout,
  LayoutProps,
  Resource,
  TranslationMessages,
} from 'react-admin';
import { CardList } from './lists/CardList';
import { TagList } from './lists/TagList';
import { SetList } from './lists/SetList';
import { CardCreate } from './create/CardCreate';
import { TagCreate } from './create/TagCreate';
import { CardEdit } from './edit/CardEdit';
import CustomDataProvider from './dataprovider/DataProvider';
import { TagEdit } from './edit/TagEdit';
import { SetEdit } from './edit/SetEdit';
import { SetCreate } from './create/SetCreate';
import { CustomAppBar } from './appbar/CustomAppBar';
import englishMessages from 'ra-language-english';
import dutchMessages from 'ra-language-dutch';
import polyglotI18nProvider from 'ra-i18n-polyglot';

const dataProvider = CustomDataProvider('http://localhost:3002/api');
const layout = (props: LayoutProps) => (
  <Layout {...props} appBar={CustomAppBar} />
);
const i18nProvider = polyglotI18nProvider(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  (locale) => (locale === 'nl' ? dutchMessages : englishMessages),
  'en',
);

const App = (): JSX.Element => (
  <Admin
    dataProvider={dataProvider}
    i18nProvider={i18nProvider}
    layout={layout}
  >
    <Resource
      name="cards"
      list={CardList}
      edit={CardEdit}
      create={CardCreate}
    />
    <Resource name="tags" list={TagList} edit={TagEdit} create={TagCreate} />
    <Resource name="sets" list={SetList} edit={SetEdit} create={SetCreate} />
  </Admin>
);

export default App;
