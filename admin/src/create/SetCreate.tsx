import { Create, CreateProps } from 'react-admin';
import { SetForm } from '../form/SetForm';

export const SetCreate = (props: CreateProps): JSX.Element => (
  <Create {...props}>
    <SetForm />
  </Create>
);
