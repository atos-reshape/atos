import {Datagrid, DateField, List, TextField} from "react-admin";

export const TagList = () => (
  <List>
    <Datagrid>
      <TextField source="id"/>
      <TextField source="name"/>
      <DateField source="createdAt"/>
      <DateField source="updatedAt"/>
      <TextField source="deletedAt" emptyText="Not deleted"/>
    </Datagrid>
  </List>
);
