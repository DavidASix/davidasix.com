import { cn } from "~/lib/utils";

interface PizzaRatingProps {
  rating: number;
  className?: string;
}

export function PizzaRating({
  rating,
  className = "text-base",
}: PizzaRatingProps) {
  const fullSlices = Math.floor(rating);
  const hasPartialSlice = rating % 1 > 0;
  const partialPercentage = (rating % 1) * 100;

  const renderSlice = (i: number) => {
    const sliceIndex = i + 1;

    // Full opacity slices (below the rating)
    if (sliceIndex <= fullSlices) {
      return (
        <span key={i} className={`text-amber-700 opacity-100`}>
          🍕
        </span>
      );
    }

    // Partial slice (the slice that's being cut)
    if (hasPartialSlice && sliceIndex === fullSlices + 1) {
      return (
        <span key={i} className={`relative inline-block`}>
          {/* Base slice at 20% opacity */}
          <span className="text-amber-700 opacity-20">🍕</span>
          {/* Overlay slice at 100% opacity, clipped to percentage */}
          <span
            className="absolute top-0 left-0 overflow-hidden text-amber-700"
            style={{ width: `${partialPercentage}%` }}
          >
            🍕
          </span>
        </span>
      );
    }

    // Empty slices (above the rating) at 20% opacity
    return (
      <span key={i} className={`text-amber-700 opacity-20`}>
        🍕
      </span>
    );
  };

  const firstRow = Array.from({ length: 5 }, (_, i) => i);
  const secondRow = Array.from({ length: 5 }, (_, i) => i + 5);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-1",
        className,
      )}
      title={`${rating}/10`}
    >
      <div className="flex flex-wrap gap-1">
        <div className="flex gap-1">{firstRow.map(renderSlice)}</div>
        <div className="flex gap-1">{secondRow.map(renderSlice)}</div>
      </div>

      <span className={`text-foreground font-bold`}>{rating}/10</span>
    </div>
  );
}
