import React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export type GameDialogProps = {
  isOpen: boolean;
  isGameOver: boolean;
  onResume: () => void;
};

export const GameDialog: React.FC<GameDialogProps> = ({
  isOpen,
  isGameOver,
  onResume,
}) => (
  <AlertDialog open={isOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{isGameOver ? 'Game Over!' : 'Victory!'}</AlertDialogTitle>
        <AlertDialogDescription>
          {isGameOver
            ? 'Game Over! Better luck next time. Want to try again?'
            : "Congratulations! You've won the game. Ready for another round?"}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={onResume}>
          {isGameOver ? 'Try Again' : 'Restart'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
