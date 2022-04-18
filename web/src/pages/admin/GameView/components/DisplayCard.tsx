import { useGetCard } from '../../../../api/requests/card';

export const DisplayCard = ({ id }: { id: string }) => {
  const { data } = useGetCard(id);

  if (data === undefined) return null;

  return (
    <div
      style={{
        borderRadius: 10,
        backgroundColor: 'rgba(237, 242, 255, 1)',
        padding: 8,
        maxWidth: 360,
        margin: 4
      }}
    >
      {data.text}
    </div>
  );
};
