interface Props {
  status: 'playing' | 'won' | 'lost';
  onRestart:     () => void;
  onKeepPlaying: () => void;
}

export const GameOverlay = ({ status, onRestart, onKeepPlaying }: Props) => {
  if (status === 'playing') return null;

  const isWon = status === 'won';

  return (
    <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-4 bg-black/50 backdrop-blur-sm z-10">
      <h2 className={`text-4xl font-bold ${isWon ? 'text-yellow-300' : 'text-white'}`}>
        {isWon ? '🎉 You Win!' : '💀 Game Over'}
      </h2>
      <div className="flex gap-3">
        {isWon && (
          <button
            onClick={onKeepPlaying}
            className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-lg transition"
          >
            Keep Playing
          </button>
        )}
        <button
          onClick={onRestart}
          className="px-5 py-2 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-lg transition"
        >
          New Game
        </button>
      </div>
    </div>
  );
};