interface PizzaRatingProps {
  rating: number;
  size?: "small" | "large";
}

export function PizzaRating({ rating, size = "small" }: PizzaRatingProps) {
  const fullSlices = Math.floor(rating);
  const halfSlice = rating % 1 >= 0.5;
  const emptySlices = 10 - fullSlices - (halfSlice ? 1 : 0);

  const sliceSize = size === "large" ? "text-3xl" : "text-base";
  const textSize = size === "large" ? "text-2xl" : "text-sm";
  const marginSize = size === "large" ? "ml-3" : "ml-2";

  return (
    <div className="flex items-center gap-1" title={`${rating}/10`}>
      {Array.from({ length: fullSlices }).map((_, i) => (
        <span key={`full-${i}`} className={`${sliceSize} text-amber-400`}>
          🍕
        </span>
      ))}
      {halfSlice && (
        <span className={`${sliceSize} text-amber-400 opacity-50`}>🍕</span>
      )}
      {Array.from({ length: emptySlices }).map((_, i) => (
        <span key={`empty-${i}`} className={`${sliceSize} text-gray-600`}>
          🍕
        </span>
      ))}
      <span className={`${marginSize} ${textSize} font-bold text-white`}>
        {rating}/10
      </span>
    </div>
  );
}
