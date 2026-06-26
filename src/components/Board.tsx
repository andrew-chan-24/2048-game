import { Tile } from './Tile';
import { Grid } from '../utils/gameLogic';

interface Props {
  grid: Grid;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd:   (e: React.TouchEvent) => void;
}

export const Board = ({ grid, onTouchStart, onTouchEnd }: Props) => (
  <div
    className="bg-board p-2 sm:p-3 rounded-xl w-full max-w-[480px] mx-auto touch-none select-none"
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
  >
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {grid.flat().map((cell, i) => (
        <Tile key={i} value={cell} />
      ))}
    </div>
  </div>
);