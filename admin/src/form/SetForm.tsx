import {
  ReferenceArrayInput,
  ReferenceInput,
  SelectArrayInput,
  SelectInput,
  SimpleForm,
  TextInput,
} from 'react-admin';

export const SetForm = (): JSX.Element => (
  <SimpleForm>
    <TextInput label="Name" source="name" />
    <ReferenceArrayInput label="Cards" source="cards" reference="cards">
      <SelectArrayInput optionText="id" />
    </ReferenceArrayInput>
    <ReferenceInput
      label="Tag"
      source="tag"
      reference="tags"
      defaultValue={null}
    >
      <SelectInput
        optionText="name"
        emptyText="No tag selected"
        emptyValue={null}
        defaultValue={null}
        createLabel="Create a new tag"
        onCreate={() => {
          // Navigate to create tag page
          window.location.href = '/#/tags/create';
        }}
      />
    </ReferenceInput>
  </SimpleForm>
);
