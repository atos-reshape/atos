function CardSocket() {
  const socketState = useContext(SocketContext);
  return (
    <h1>
      {socketState.state === undefined ? 'undefined' : socketState.state.id}
    </h1>
  );
}

export default CardSocket;
