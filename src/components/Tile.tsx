// src/components/Tile.tsx
interface Props {
  value: number | null;
}

const tileStyles: Record<number, string> = {
  2:    'bg-tile-2    text-[#776e65]',
  4:    'bg-tile-4    text-[#776e65]',
  8:    'bg-tile-8    text-white',
  16:   'bg-tile-16   text-white',
  32:   'bg-tile-32   text-white',
  64:   'bg-tile-64   text-white',
  128:  'bg-tile-128  text-white',
  256:  'bg-tile-256  text-white',
  512:  'bg-tile-512  text-white',
  1024: 'bg-tile-1024 text-white',
  2048: 'bg-tile-2048 text-white',
};

const getFontSize = (value: number): string => {
  if (value >= 1024) return 'text-xl sm:text-2xl';
  if (value >= 128)  return 'text-2xl sm:text-3xl';
  return 'text-3xl sm:text-4xl';
};

export const Tile = ({ value }: Props) => {
  if (!value) {
    return <div className="bg-cell rounded-lg aspect-square" />;
  }

  const style = tileStyles[value] ?? 'bg-tile-high text-white';
  const fontSize = getFontSize(value);

  return (
    <div
      className={`
        ${style} ${fontSize}
        rounded-lg aspect-square
        flex items-center justify-center
        font-bold font-game
        transition-all duration-100
        animate-pop
      `}
    >
      {value}
    </div>
  );
};