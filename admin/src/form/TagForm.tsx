import { SimpleForm, TextInput } from 'react-admin';

export const TagForm = (): JSX.Element => (
  <SimpleForm>
    <TextInput name="name" label="Name" source="name" />
  </SimpleForm>
);
