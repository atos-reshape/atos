import React from 'react';
import { Admin, Resource } from 'react-admin';
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

const dataProvider = CustomDataProvider('http://localhost:3002/api');

const App = (): JSX.Element => (
  <Admin dataProvider={dataProvider}>
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
