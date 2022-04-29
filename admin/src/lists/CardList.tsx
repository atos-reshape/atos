import {Datagrid, DateField, EditButton, List, ReferenceField, TextField} from "react-admin";

export const CardList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="text" />
      <ReferenceField source="tagId" reference="tags" >
        <TextField source="name" />
      </ReferenceField>
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <TextField source="deletedAt" />
      <EditButton />
    </Datagrid>
  </List>
);
