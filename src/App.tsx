import { Board }       from './components/Board';
import { ScoreBoard }  from './components/ScoreBoard';
import { GameOverlay } from './components/GameOverlay';
import { useGame }     from './hooks/useGame';

export default function App() {
  const {
    grid, score, best, status,
    canUndo, dispatch,
    onTouchStart, onTouchEnd,
  } = useGame();

  return (
    <div className="min-h-screen bg-[#faf8ef] flex flex-col items-center justify-start px-4 py-6 font-game">

      {/* ── Header ── */}
      <div className="w-full max-w-[480px] flex items-center justify-between mb-4">
        <h1 className="text-5xl font-bold text-[#776e65]">2048</h1>
        <ScoreBoard score={score} best={best} />
      </div>

      {/* ── Subtitle & Buttons ── */}
      <div className="w-full max-w-[480px] flex items-center justify-between mb-4">
        <p className="text-sm text-[#776e65]">
          Join tiles to get <strong>2048!</strong>
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={!canUndo}
            className="px-3 py-1 text-sm bg-board text-white font-bold rounded-lg disabled:opacity-40 hover:opacity-90 transition"
          >
            ↩ Undo
          </button>
          <button
            onClick={() => dispatch({ type: 'RESTART' })}
            className="px-3 py-1 text-sm bg-board text-white font-bold rounded-lg hover:opacity-90 transition"
          >
            New Game
          </button>
        </div>
      </div>

      {/* ── Board ── */}
      <div className="relative w-full max-w-[480px]">
        <Board
          grid={grid}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />
        <GameOverlay
          status={status}
          onRestart={() => dispatch({ type: 'RESTART' })}
          onKeepPlaying={() => dispatch({ type: 'KEEP_PLAYING' })}
        />
      </div>

      {/* ── Instructions ── */}
      <p className="mt-6 text-xs text-[#776e65] text-center max-w-xs">
        Use <strong>arrow keys</strong> or <strong>WASD</strong> on desktop.
        <br />
        <strong>Swipe</strong> on mobile. <strong>Ctrl+Z</strong> to undo.
      </p>
    </div>
  );
}