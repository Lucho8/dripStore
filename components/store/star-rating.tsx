import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  totalReviews?: number;
  size?: number;
}

export function StarRating({
  rating,
  totalReviews,
  size = 16,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={size} fill="#fbbf24" color="#fbbf24" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star size={size} color="#fbbf24" />
            <div className="absolute top-0 left-0 overflow-hidden w-[50%]">
              <Star size={size} fill="#fbbf24" color="#fbbf24" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} color="#e5e7eb" />
        ))}
      </div>

      {totalReviews !== undefined && (
        <span className="text-sm text-muted-foreground">
          ({totalReviews} {totalReviews === 1 ? "reseña" : "reseñas"})
        </span>
      )}
    </div>
  );
}
