interface Props {
  score: number;
  best: number;
}

const ScoreBox = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center bg-board text-white rounded-lg px-4 py-2 min-w-[80px]">
    <span className="text-xs font-bold tracking-widest opacity-80">{label}</span>
    <span className="text-xl font-bold">{value}</span>
  </div>
);

export const ScoreBoard = ({ score, best }: Props) => (
  <div className="flex gap-3">
    <ScoreBox label="SCORE" value={score} />
    <ScoreBox label="BEST"  value={best}  />
  </div>
);