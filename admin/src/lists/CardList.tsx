import {
  ArrayField,
  ChipField,
  Datagrid,
  DateField,
  DeleteButton,
  EditButton,
  List,
  ReferenceField,
  SingleFieldList,
  TextField,
} from 'react-admin';

export const CardList = (): JSX.Element => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <ArrayField source="translations">
        <SingleFieldList>
          <ChipField source="text" />
        </SingleFieldList>
      </ArrayField>
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
