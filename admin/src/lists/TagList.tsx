import {
  Datagrid,
  DateField,
  DeleteButton,
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
      <DeleteButton />
    </Datagrid>
  </List>
);
