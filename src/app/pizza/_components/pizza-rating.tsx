interface PizzaRatingProps {
  rating: number;
  size?: "small" | "large";
}

export function PizzaRating({ rating, size = "small" }: PizzaRatingProps) {
  const sliceSize = size === "large" ? "text-3xl" : "text-base";
  const textSize = size === "large" ? "text-2xl" : "text-sm";
  const marginSize = size === "large" ? "ml-3" : "ml-2";

  // Always show 10 slices
  const totalSlices = 10;
  const fullSlices = Math.floor(rating);
  const hasPartialSlice = rating % 1 > 0;
  const partialPercentage = (rating % 1) * 100;

  return (
    <div className="flex items-center gap-1" title={`${rating}/10`}>
      {Array.from({ length: totalSlices }).map((_, i) => {
        const sliceIndex = i + 1;

        // Full opacity slices (below the rating)
        if (sliceIndex <= fullSlices) {
          return (
            <span key={i} className={`${sliceSize} text-amber-700 opacity-100`}>
              🍕
            </span>
          );
        }

        // Partial slice (the slice that's being cut)
        if (hasPartialSlice && sliceIndex === fullSlices + 1) {
          return (
            <span key={i} className={`relative inline-block ${sliceSize}`}>
              {/* Base slice at 20% opacity */}
              <span className="text-amber-700 opacity-20">🍕</span>
              {/* Overlay slice at 100% opacity, clipped to percentage */}
              <span
                className="absolute left-0 top-0 overflow-hidden text-amber-700"
                style={{ width: `${partialPercentage}%` }}
              >
                🍕
              </span>
            </span>
          );
        }

        // Empty slices (above the rating) at 20% opacity
        return (
          <span key={i} className={`${sliceSize} text-amber-700 opacity-20`}>
            🍕
          </span>
        );
      })}
      <span className={`${marginSize} ${textSize} font-bold text-foreground`}>
        {rating}/10
      </span>
    </div>
  );
}
