import { Button } from '@headlessui/react';

const GameNotFound = () => {
  return (
    <div>
      <h2>Game not found.</h2>
      <div>
        <p>Start a:</p>
        <Button>Quick game</Button>
        <Button>Custom game</Button>
      </div>
    </div>
  );
};

export default GameNotFound;
