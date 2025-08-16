import React, { forwardRef, useImperativeHandle, useState } from 'react';

export type GameInfoHandle = {
  updateLife: (life: number) => void;
  updateScore: (score: number) => void;
  updateLevel: (level: number) => void;
};

type GameInfoProps = {
  initialLife?: number;
  initialLevel?: number;
  initialScore?: number;
};

export const GameInfo = forwardRef<GameInfoHandle, GameInfoProps>(
  ({ initialLife, initialLevel, initialScore }, ref) => {
    const [life, setLife] = useState<number>(initialLife ?? 0);
    const [level, setLevel] = useState<number>(initialLevel ?? 1);
    const [score, setScore] = useState<number>(initialScore ?? 0);

    useImperativeHandle(
      ref,
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
  },
);

GameInfo.displayName = 'GameInfo';
