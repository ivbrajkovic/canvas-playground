import React, { useImperativeHandle, useState } from 'react';

export type GameInfoHandle = {
  updateLife: (life: number) => void;
  updateScore: (score: number) => void;
  updateLevel: (level: number) => void;
};

type GameInfoProps = {
  ref: React.Ref<GameInfoHandle>;
};

export const GameInfo = (props: GameInfoProps) => {
  const [life, setLife] = useState(0);
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);

  useImperativeHandle(
    props.ref,
    () => ({
      updateLife: setLife,
      updateLevel: setLevel,
      updateScore: setScore,
    }),
    [],
  );

  return (
    <div className="flex justify-between">
      <h3 className="font-bold text-gray-500">
        Life <span>{life}</span>
      </h3>
      <h3 className="font-bold text-gray-500">
        Level <span>{level}</span>
      </h3>
      <h3 className="font-bold text-gray-500">
        Score <span>{score}</span>
      </h3>
    </div>
  );
};
