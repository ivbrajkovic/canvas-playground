import { Direction } from '@/app/(2D)/pacman/utils/enum';

export const getRandomDirection = () => Math.floor(Math.random() * 4) as Direction;
