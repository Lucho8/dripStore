"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { createReview } from "@/lib/actions/review.actions";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await createReview(productId, rating, comment);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setRating(0);
        setComment("");
        router.refresh();
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al enviar tu reseña.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 bg-green-50 text-green-700 rounded-xl border border-green-200 mt-6">
        <h3 className="font-semibold text-lg mb-2">¡Gracias por tu reseña!</h3>
        <p>Tu opinión ha sido enviada exitosamente.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mt-6 p-6 bg-neutral-50 rounded-xl border border-neutral-200"
    >
      <h3 className="font-semibold text-lg">Dejar una reseña</h3>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Selector interactivo de estrellas */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={28}
              fill={star <= (hoverRating || rating) ? "#fbbf24" : "transparent"}
              color={star <= (hoverRating || rating) ? "#fbbf24" : "#d1d5db"}
            />
          </button>
        ))}
      </div>

      <textarea
        placeholder="¿Qué te pareció el producto? (Opcional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-3 rounded-lg border border-neutral-300 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="self-start px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Enviando..." : "Enviar reseña"}
      </button>
    </form>
  );
}