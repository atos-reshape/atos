import { Edit, EditProps } from 'react-admin';
import { SetForm } from '../form/SetForm';

export const SetEdit = (props: EditProps): JSX.Element => (
  <Edit {...props}>
    <SetForm />
  </Edit>
);
