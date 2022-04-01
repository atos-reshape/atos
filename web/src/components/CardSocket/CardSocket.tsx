import { SocketContext } from '../../hooks/useSocketContext';
import { useContext } from 'react';

//component to test context state
function CardSocket() {
  const socketState = useContext(SocketContext);
  return (
    <h1>
      {socketState.state === undefined ? 'undefined' : socketState.state.id}
    </h1>
  );
}

export default CardSocket;
