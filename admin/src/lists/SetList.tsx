import {
  ChipField,
  Datagrid,
  DateField,
  DeleteButton,
  EditButton,
  List,
  ReferenceArrayField,
  ReferenceField,
  SingleFieldList,
  TextField,
} from 'react-admin';

export const SetList = (): JSX.Element => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <ReferenceArrayField source="cards" reference="cards">
        <SingleFieldList>
          <ChipField source="id" />
        </SingleFieldList>
      </ReferenceArrayField>
      <ReferenceField source="tag" reference="tags">
        <ChipField source="name" emptyText="No tag assigned" />
      </ReferenceField>
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <TextField source="deletedAt" emptyText="Not deleted" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
