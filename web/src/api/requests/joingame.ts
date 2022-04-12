import { useCreate } from '../react-query/hooks';

export const useJoinGame = (code: string) => {
  return useCreate<any>(
    `${process.env.GATEWAY_BASE_URL}/api/auth/join/${code}`
  );
};
