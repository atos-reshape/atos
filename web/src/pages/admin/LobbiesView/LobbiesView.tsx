import { useGetLobbies } from '../../../api/requests/lobbies';
import {
  ActionIcon,
  Button,
  Container,
  Group,
  Menu,
  Skeleton,
  Table,
  Title
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { Dots, Settings } from 'tabler-icons-react';

export function LobbiesView(): JSX.Element {
  const { data, isLoading } = useGetLobbies();

  return (
    <Container
      size="md"
      px="xs"
      style={{
        marginTop: 25,
        backgroundColor: 'white',
        padding: 15,
        minHeight: 'calc(100% - 80px)',
        borderRadius: 6
      }}
    >
      <Group position="apart" style={{ marginBottom: 25 }}>
        <Title order={3}>Active Games</Title>
        <Button component={Link} to={'/admin/create'}>
          Create a new game
        </Button>
      </Group>
      <Skeleton visible={isLoading}>
        <Table>
          <thead>
            <tr>
              <th>Lobby Title</th>
              <th>Game Code</th>
              <th>Created</th>
              <th style={{ width: 20 }} />
            </tr>
          </thead>
          <tbody>
            {data?.map((lobby) => (
              <tr key={lobby.id}>
                <td>{lobby.title}</td>
                <td>{lobby.code}</td>
                <td>{new Date(lobby.createdAt).toDateString()}</td>
                <td>
                  <Menu
                    control={
                      <ActionIcon variant="light" color="blue">
                        <Dots size={16} />
                      </ActionIcon>
                    }
                  >
                    <Menu.Label>Actions</Menu.Label>
                    <Menu.Item
                      icon={<Settings size={14} />}
                      component={Link}
                      to={`/admin/participate?id=${lobby.id}`}
                    >
                      Open Game
                    </Menu.Item>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Skeleton>
    </Container>
  );
}
