import { Edit, EditProps } from 'react-admin';
import { TagForm } from '../form/TagForm';

export const TagEdit = (props: EditProps): JSX.Element => (
  <Edit {...props}>
    <TagForm />
  </Edit>
);
