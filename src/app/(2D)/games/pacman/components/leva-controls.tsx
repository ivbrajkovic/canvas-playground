import { button, Leva, useControls } from 'leva';

import { Game } from '@/app/(2D)/games/pacman/classes/game';
import { useAnimationController } from '@/hooks/use-animation-controller';

type LevaControlsProps = {
  gameRef: React.RefObject<Game | null>;
  animation: ReturnType<typeof useAnimationController>;
};

export const LevaControls = (props: LevaControlsProps) => {
  useControls({
    animate: {
      value: true,
      onChange: props.animation.toggle,
    },
    nextLevel: button(() => {
      props.gameRef.current?.nextLevel();
    }),
  });

  return <Leva fill />;
};
