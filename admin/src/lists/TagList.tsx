import {
  Datagrid,
  DateField,
  DeleteButton,
  EditButton,
  List,
  TextField,
} from 'react-admin';

export const TagList = (): JSX.Element => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <TextField source="deletedAt" emptyText="Not deleted" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
