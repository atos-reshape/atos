import {
  ArrayInput,
  BooleanInput,
  Create,
  CreateProps,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput
} from "react-admin";
import {getAll639_1} from "all-iso-language-codes";

export const CardCreate = (props: CreateProps): JSX.Element => (
  <Create {...props}>
    <SimpleForm>
      <ArrayInput source="translations">
        <SimpleFormIterator disableReordering>
          <TextInput label="Card text" source="text"/>
          <SelectInput label="Language" source="language" choices={getAll639_1().map((language) => ({
            id: language,
            name: language
          }))}/>
          <BooleanInput label="Is this the default language?" source="isDefaultLanguage"/>
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput label="Tag" source="tag" defaultValue={null}/>
    </SimpleForm>
  </Create>
);
