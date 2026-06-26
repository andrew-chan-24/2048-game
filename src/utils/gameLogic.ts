export type Grid = (number | null)[][];

// ─── Grid Helpers ────────────────────────────────────────────────────────────

export const createEmptyGrid = (): Grid =>
  Array.from({ length: 4 }, () => Array(4).fill(null));

export const cloneGrid = (grid: Grid): Grid =>
  grid.map(row => [...row]);

// ─── Tile Spawning ───────────────────────────────────────────────────────────

export const spawnTile = (grid: Grid): Grid => {
  const empty: [number, number][] = [];
  grid.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell === null) empty.push([r, c]);
    })
  );
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = cloneGrid(grid);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
};

// ─── Row Logic ───────────────────────────────────────────────────────────────

/** Slide and merge a single row to the left. Returns { row, score } */
const slideLeft = (row: (number | null)[]): { row: (number | null)[]; score: number } => {
  const nums = row.filter((v): v is number => v !== null);
  let score = 0;
  const merged: (number | null)[] = [];

  let i = 0;
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const val = nums[i] * 2;
      merged.push(val);
      score += val;
      i += 2;
    } else {
      merged.push(nums[i]);
      i++;
    }
  }

  while (merged.length < 4) merged.push(null);
  return { row: merged, score };
};

// ─── Grid Rotations ──────────────────────────────────────────────────────────

const rotateClockwise = (grid: Grid): Grid =>
  grid[0].map((_, colIdx) => grid.map(row => row[colIdx]).reverse());

const rotateCounterClockwise = (grid: Grid): Grid =>
  grid[0].map((_, colIdx) => grid.map(row => row[3 - colIdx]));

const rotate180 = (grid: Grid): Grid =>
  grid.map(row => [...row].reverse()).reverse();

// ─── Move Engine ─────────────────────────────────────────────────────────────

export type Direction = 'left' | 'right' | 'up' | 'down';

export const move = (
  grid: Grid,
  direction: Direction
): { grid: Grid; score: number; moved: boolean } => {
  let rotated: Grid;

  // Rotate so that every direction becomes a "slide left" operation
  switch (direction) {
    case 'left':  rotated = cloneGrid(grid); break;
    case 'right': rotated = rotate180(grid); break;
    case 'up':    rotated = rotateCounterClockwise(grid); break;
    case 'down':  rotated = rotateClockwise(grid); break;
  }

  let totalScore = 0;
  const slid = rotated.map(row => {
    const { row: newRow, score } = slideLeft(row);
    totalScore += score;
    return newRow;
  });

  // Rotate back
  let result: Grid;
  switch (direction) {
    case 'left':  result = slid; break;
    case 'right': result = rotate180(slid); break;
    case 'up':    result = rotateClockwise(slid); break;
    case 'down':  result = rotateCounterClockwise(slid); break;
  }

  const moved = JSON.stringify(result) !== JSON.stringify(grid);
  return { grid: result, score: totalScore, moved };
};

// ─── Win / Loss Detection ────────────────────────────────────────────────────

export const hasWon = (grid: Grid): boolean =>
  grid.some(row => row.some(cell => cell === 2048));

export const hasLost = (grid: Grid): boolean => {
  // Any empty cell → not lost
  if (grid.some(row => row.some(cell => cell === null))) return false;
  // Any adjacent equal cells → not lost
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const v = grid[r][c];
      if (c < 3 && grid[r][c + 1] === v) return false;
      if (r < 3 && grid[r + 1][c] === v) return false;
    }
  }
  return true;
};

// ─── Initial Game State ──────────────────────────────────────────────────────

export const createInitialGrid = (): Grid => {
  let grid = createEmptyGrid();
  grid = spawnTile(grid);
  grid = spawnTile(grid);
  return grid;
};