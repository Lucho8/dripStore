"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { toggleWishlist } from "@/lib/actions/wishlist.actions";
import { toast } from "sonner";

interface WishlistButtonProps {
  productId: string;
  initialIsFavorited?: boolean;
}

export function WishlistButton({
  productId,
  initialIsFavorited = false,
}: WishlistButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimismo: Pinta el corazón inmediatamente
    setIsFavorited(!isFavorited);
    setLoading(true);

    const res = await toggleWishlist(productId);

    setLoading(false);

    if (res.error) {
      setIsFavorited(initialIsFavorited);
      toast.error(res.error);
    } else {
      // Si salió bien y se guardó
      if (res.isFavorited) {
        toast.success("Guardado en favoritos");
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      style={{
        padding: "8px",
        borderRadius: "9999px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(4px)",
        border: "1px solid #e5e5e5",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "transform 0.1s",
        transform: "scale(1)",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      aria-label="Agregar a favoritos"
      title="Agregar a favoritos"
    >
      <Heart
        size={20}
        color={isFavorited ? "#ef4444" : "#737373"}
        fill={isFavorited ? "#ef4444" : "transparent"}
        style={{ transition: "all 0.2s" }}
      />
    </button>
  );
}
