import ResultsCard from '../../components/ResultsCard/ResultsCard';
import { Group, Text } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useGetTags, Tag } from '../../api/requests/tags';

function IndividualResults() {
  const [tagDescription, setTagDescription] = useState('');
  const [outcome, setOutcome] = useState('');
  const { data } = useGetTags();
  useEffect(() => {
    setOutcome('blue');

    const getOutcomeTag: Tag | undefined = data?.find(
      (tag) => tag.name === outcome
    );
    console.log(data);
    console.log(getOutcomeTag);
    console.log(outcome);

    if (getOutcomeTag !== undefined)
      setTagDescription(getOutcomeTag.description);
  }, []);
  return (
    <>
      <h1>Personal results</h1>
      <Text>Your personal profile based on the cards you selected</Text>
      <Group direction="row">
        <ResultsCard CardText="Testing out the result screen cards so that they look good" />
        <ResultsCard CardText="Testing out the result screen cards so that they look good" />
        <ResultsCard CardText="Testing out the result screen cards so that they look good" />
        <ResultsCard CardText="Testing out the result screen cards so that they look good" />
        <ResultsCard CardText="Testing out the result screen cards so that they look good" />
      </Group>

      <Text>{tagDescription}</Text>
    </>
  );
}

export default IndividualResults;
