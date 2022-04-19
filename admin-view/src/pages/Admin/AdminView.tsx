import { Admin, Resource, EditGuesser, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const dataProvider = jsonServerProvider('http://localhost:3002/api');

export default function AdminView(): JSX.Element {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="cards" list={ListGuesser} edit={EditGuesser} />
    </Admin>
  );
}
