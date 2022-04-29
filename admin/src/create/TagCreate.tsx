import {Create, CreateProps, SimpleForm, TextInput} from "react-admin";

export const TagCreate = (props: CreateProps): JSX.Element => (
  <Create {...props}>
    <SimpleForm>
      <TextInput name="name" label="Name" source="name"/>
    </SimpleForm>
  </Create>
);
