import { SimpleForm, TextInput } from 'react-admin';
import MarkdownEditor from '../markdown/MarkdownEditor';

export const TagForm = (): JSX.Element => (
  <SimpleForm>
    <TextInput name="name" label="Name" source="name" />
    <MarkdownEditor source="description" />
  </SimpleForm>
);
