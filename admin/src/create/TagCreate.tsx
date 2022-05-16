import { Create, CreateProps } from 'react-admin';
import { TagForm } from '../form/TagForm';

export const TagCreate = (props: CreateProps): JSX.Element => (
  <Create {...props}>
    <TagForm />
  </Create>
);
