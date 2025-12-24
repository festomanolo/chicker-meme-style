import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  isNew?: boolean;
  isTrending?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  badge,
  isNew,
  isTrending,
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("likedProducts");
      const likedIds: string[] = raw ? JSON.parse(raw) : [];
      setIsLiked(likedIds.includes(id));
    } catch {
      // noop
    }
  }, [id]);

  const persistLike = (next: boolean) => {
    try {
      const raw = localStorage.getItem("likedProducts");
      const likedIds: string[] = raw ? JSON.parse(raw) : [];
      const set = new Set(likedIds);
      if (next) set.add(id); else set.delete(id);
      localStorage.setItem("likedProducts", JSON.stringify(Array.from(set)));
