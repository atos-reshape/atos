import { Create, CreateProps } from 'react-admin';
import { CardForm } from '../form/CardForm';

export const CardCreate = (props: CreateProps): JSX.Element => (
  <Create {...props}>
    <CardForm />
  </Create>
);
