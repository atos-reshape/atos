import { Edit, EditProps } from 'react-admin';
import { CardForm } from '../form/CardForm';

export const CardEdit = (props: EditProps): JSX.Element => (
  <Edit {...props}>
    <CardForm />
  </Edit>
);
