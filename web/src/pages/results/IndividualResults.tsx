import ResultsCard from '../../components/ResultsCard/ResultsCard';
import { Group, Text } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useGetTags, Tag } from '../../api/requests/tags';
import styles from './IndividualResults.module.css';

function IndividualResults() {
  const [tagDescription, setTagDescription] = useState('');
  const [outcome, setOutcome] = useState('');
  const { data } = useGetTags();
  useEffect(() => {
    setOutcome('blue');

    const getOutcomeTag: Tag | undefined = data?.find(
      (tag) => tag.name === outcome
    );
    if (getOutcomeTag !== undefined)
      setTagDescription(getOutcomeTag.description);
  }, []);
  return (
    <Group direction="column" position="center" style={{ padding: '0% 5%' }}>
      <h1>Personal results</h1>
      <Text>Your personal profile based on the cards you selected</Text>
      <Group direction="row">
        <ResultsCard
          CardText="Testing out the result screen cards so that they look good"
          CardColor="rgb(255, 82, 105)"
          CardTextColor="white"
        />
        <ResultsCard
          CardText="Testing out the result screen cards so that they look good"
          CardColor="rgb(5, 150, 255)"
          CardTextColor="white"
        />
        <ResultsCard
          CardText="Testing out the result screen cards so that they look good"
          CardColor="rgb(184, 141, 0)"
          CardTextColor="white"
        />
        <ResultsCard
          CardText="Testing out the result screen cards so that they look good"
          CardColor="rgb(184, 141, 0)"
          CardTextColor="white"
        />
        <ResultsCard
          CardText="Testing out the result screen cards so that they look good"
          CardColor="rgb(184, 141, 0)"
          CardTextColor="white"
        />
      </Group>

      <Group
        className={styles.description}
        style={{ border: '1px solid rgb(184, 141, 0)' }}
      >
        <h1>
          Your main personal color is
          <span style={{ color: 'rgb(184, 141, 0)' }}> Yellow</span>
        </h1>
        <Text>{tagDescription}</Text>
        <Text className={styles.textDesc}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquam
          dui ut orci condimentum scelerisque ut sed magna. Nam rutrum sit amet
          leo et faucibus. Duis semper enim sit amet lectus elementum porta.
          Proin fermentum dictum mattis. Nulla suscipit quis neque ac ultricies.
          Quisque ut magna interdum, bibendum ex venenatis, tempor enim. Integer
          viverra feugiat nibh sit amet feugiat. Sed sodales auctor laoreet.
          Morbi vel purus vitae odio sagittis posuere non eu urna. Vivamus ac
          ornare enim. Aliquam vel ligula ac nisi iaculis porttitor consequat
          sed mauris.
        </Text>
        <br />
        <h3>
          Specific characteristics of{' '}
          <span style={{ color: 'rgb(184, 141, 0)' }}>yellow</span>-thinking
          people:
        </h3>
        <br />
        <ul>
          <li>Personal commitment from people</li>
          <li>Confronting in meetings</li>
          <li>Introducing power structure in a group</li>
          <li>Creating strategic alliances with a third party</li>
          <li>Putting pressure on the process</li>
        </ul>
      </Group>
    </Group>
  );
}

export default IndividualResults;
