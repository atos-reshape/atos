import React from "react";
import {Admin, EditGuesser, ListGuesser, Resource} from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import {CardList} from "./lists/CardList";
import {TagList} from "./lists/TagList";
import {CardCreate} from "./create/CardCreate";
import {TagCreate} from "./create/TagCreate";
import {CardEdit} from "./edit/CardEdit";

function App() {
  return (
    <Admin dataProvider={baseDataProvider}>
      <Resource name="cards" list={CardList} edit={CardEdit} create={CardCreate}/>
      <Resource name="tags" list={TagList} create={TagCreate}/>
      <Resource name="sets" list={ListGuesser}/>
    </Admin>
  );
}

export default App;
