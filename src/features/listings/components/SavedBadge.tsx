interface SavedBadgeProps {
  count: number;
}

const SavedBadge = ({ count }: SavedBadgeProps) => {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-full text-xs font-semibold border border-rose-100 dark:border-rose-900/50 transition-all animate-in fade-in zoom-in duration-300">
      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
      {count} {count === 1 ? "saved" : "saved"}
    </div>
  );
};

export default SavedBadge;
