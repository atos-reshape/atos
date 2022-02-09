import Card from './components/card/Card';

export default function App(): JSX.Element {
  return (
    <Card
      title="This is the title for this card"
      description="This is the description for this card"
      buttonText="Click this button"
    />
  );
}
