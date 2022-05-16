import {
  ArrayInput,
  BooleanInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
} from 'react-admin';
import { getAll639_1 } from 'all-iso-language-codes';

export const CardForm = (): JSX.Element => (
  <SimpleForm>
    <ArrayInput source="translations">
      <SimpleFormIterator disableReordering>
        <TextInput label="Card text" source="text" />
        <SelectInput
          label="Language"
          source="language"
          choices={getAll639_1().map((language) => ({
            id: language,
            name: language,
          }))}
        />
        <BooleanInput
          label="Is this the default language?"
          source="isDefaultLanguage"
        />
      </SimpleFormIterator>
    </ArrayInput>
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
