"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { createReview } from "@/lib/actions/review.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Por favor, selecciona una calificación.");
      return;
    }

    setLoading(true);
    const result = await createReview(productId, rating, comment);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("¡Gracias por tu reseña!");
      setRating(0);
      setComment("");
      router.refresh(); // Recarga los datos de la página para mostrar la reseña
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mt-6 p-6 bg-neutral-50 rounded-xl border border-neutral-200"
    >
      <h3 className="font-semibold text-lg">Dejar una reseña</h3>

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
        className="w-full p-3 rounded-lg border border-neutral-300 min-h-25 focus:outline-none focus:ring-2 focus:ring-primary"
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
