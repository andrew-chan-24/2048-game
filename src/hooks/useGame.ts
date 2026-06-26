import { useCallback, useEffect, useReducer, useRef } from 'react';
import {
  Grid,
  Direction,
  createInitialGrid,
  move,
  spawnTile,
  hasWon,
  hasLost,
} from '../utils/gameLogic';

// ─── State & Actions ─────────────────────────────────────────────────────────

interface GameState {
  grid: Grid;
  score: number;
  best: number;
  status: 'playing' | 'won' | 'lost';
  history: { grid: Grid; score: number }[]; // for undo
}

type Action =
  | { type: 'MOVE'; direction: Direction }
  | { type: 'RESTART' }
  | { type: 'UNDO' }
  | { type: 'KEEP_PLAYING' };

// ─── Reducer ─────────────────────────────────────────────────────────────────

const MAX_HISTORY = 10;

const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'MOVE': {
      if (state.status === 'lost') return state;
      if (state.status === 'won') return state; // must press "keep playing" first

      const { grid: newGrid, score: gained, moved } = move(state.grid, action.direction);
      if (!moved) return state;

      const spawned = spawnTile(newGrid);
      const newScore = state.score + gained;
      const newBest = Math.max(state.best, newScore);
      const newStatus = hasWon(spawned)
        ? 'won'
        : hasLost(spawned)
        ? 'lost'
        : 'playing';

      return {
        grid: spawned,
        score: newScore,
        best: newBest,
        status: newStatus,
        history: [
          ...state.history.slice(-MAX_HISTORY),
          { grid: state.grid, score: state.score },
        ],
      };
    }

    case 'UNDO': {
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      return {
        ...state,
        grid: prev.grid,
        score: prev.score,
        status: 'playing',
        history: state.history.slice(0, -1),
      };
    }

    case 'RESTART': {
      return {
        grid: createInitialGrid(),
        score: 0,
        best: state.best,
        status: 'playing',
        history: [],
      };
    }

    case 'KEEP_PLAYING': {
      return { ...state, status: 'playing' };
    }

    default:
      return state;
  }
};

// ─── localStorage helpers ────────────────────────────────────────────────────

const BEST_KEY = '2048-best';
const loadBest = (): number => parseInt(localStorage.getItem(BEST_KEY) ?? '0', 10);
const saveBest = (v: number) => localStorage.setItem(BEST_KEY, String(v));

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useGame = () => {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    grid: createInitialGrid(),
    score: 0,
    best: loadBest(),
    status: 'playing' as const,
    history: [],
  }));

  // Persist best score
  useEffect(() => {
    saveBest(state.best);
  }, [state.best]);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const keyMap: Record<string, Direction> = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down',
      a: 'left', A: 'left',
      d: 'right', D: 'right',
      w: 'up', W: 'up',
      s: 'down', S: 'down',
    };

    const onKey = (e: KeyboardEvent) => {
      const dir = keyMap[e.key];
      if (dir) {
        e.preventDefault();
        dispatch({ type: 'MOVE', direction: dir });
      }
      if (e.ctrlKey && e.key === 'z') dispatch({ type: 'UNDO' });
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ── Touch / Swipe ─────────────────────────────────────────────────────────
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;

    const MIN_SWIPE = 30;
    if (Math.abs(dx) < MIN_SWIPE && Math.abs(dy) < MIN_SWIPE) return;

    let dir: Direction;
    if (Math.abs(dx) > Math.abs(dy)) {
      dir = dx > 0 ? 'right' : 'left';
    } else {
      dir = dy > 0 ? 'down' : 'up';
    }
    dispatch({ type: 'MOVE', direction: dir });
  }, []);

  return {
    grid: state.grid,
    score: state.score,
    best: state.best,
    status: state.status,
    canUndo: state.history.length > 0,
    dispatch,
    onTouchStart,
    onTouchEnd,
  };
};